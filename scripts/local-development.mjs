import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { creatorIdForUid, InvalidSystemError, makePrivateSystem, publicSystemProjection } from "../lib/design-systems.js";
import { getSystemId, readJsonBody, requireJsonContentType, requireMethod, sendError, sendJson } from "../lib/http.js";
import { publicRecordFromValue, systemInputFromRequest, toPrivateResponse } from "../lib/system-records.js";

const port = Number(process.env.DSGEN_LOCAL_PORT || 3000);
const uid = "localhost";
const creatorId = creatorIdForUid(uid);
const creatorName = "Local creator";
const project = new URL("../", import.meta.url);
const folders = { save: new URL(".local-data/save/", project), publish: new URL(".local-data/publish/", project) };
for (const folder of Object.values(folders)) mkdirSync(folder, { recursive: true });

const staticFiles = new Set(["/index.html", "/auth-ui.js", "/dashboard.js", "/community.js", "/dashboard-enhancements.js"]);
const methods = new Map([
  ["/api/systems", ["GET", "POST"]],
  ["/api/systems/item", ["GET", "PUT", "DELETE"]],
  ["/api/systems/publish", ["POST"]],
  ["/api/systems/unpublish", ["POST"]],
  ["/api/community/gallery", ["GET"]],
  ["/api/community/system", ["GET"]],
  ["/api/community/creator", ["GET"]],
  ["/api/community/copy", ["POST"]],
]);

function file(folder, id) {
  return new URL(`${id}.json`, folders[folder]);
}

function read(folder, id) {
  try {
    return JSON.parse(readFileSync(file(folder, id), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function write(folder, id, record) {
  const destination = file(folder, id);
  const temporary = new URL(`${id}.${randomUUID()}.tmp`, folders[folder]);
  try {
    writeFileSync(temporary, JSON.stringify(record, null, 2) + "\n", { mode: 0o600 });
    renameSync(temporary, destination);
  } finally {
    rmSync(temporary, { force: true });
  }
}

function ids(folder) {
  return readdirSync(folders[folder])
    .filter((name) => name.endsWith(".json"))
    .map((name) => getSystemId(name.slice(0, -5)))
    .filter(Boolean);
}

function savedResponse(id, record) {
  if (!record) return null;
  const published = read("publish", id);
  return toPrivateResponse(id, {
    ...record,
    ...(published && { sharing: { visibility: "public", status: "published", publishedAt: published.publishedAt } }),
  });
}

function publishedSystems() {
  return ids("publish")
    .map((id) => publicRecordFromValue(read("publish", id)))
    .filter(Boolean)
    .sort((a, b) => b.publishedAt - a.publishedAt);
}

async function readRequest(request, response) {
  if (!requireJsonContentType(request, response)) return null;
  const chunks = [];
  let size = 0;
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    size += chunk.length;
    if (size > 64 * 1024) {
      sendError(response, 413);
      request.resume();
      return null;
    }
    chunks.push(chunk);
  }
  request.body = Buffer.concat(chunks).toString("utf8");
  return readJsonBody(request, response);
}

function handleApi(request, response, url, body) {
  const path = url.pathname;
  const method = request.method;
  if (path === "/api/community/gallery") return sendJson(response, 200, { systems: publishedSystems() });
  if (path === "/api/community/creator") {
    const systems = publishedSystems();
    if (url.searchParams.get("id") !== creatorId || systems.length === 0) return sendError(response, 404);
    return sendJson(response, 200, { creator: { id: creatorId, name: creatorName }, systems });
  }
  if (path === "/api/systems") {
    if (method === "GET") {
      const systems = ids("save").map((id) => savedResponse(id, read("save", id)))
        .filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt);
      return sendJson(response, 200, { systems });
    }
    const id = randomUUID();
    const record = makePrivateSystem(systemInputFromRequest(body), { uid, now: Date.now() });
    write("save", id, record);
    return sendJson(response, 201, { system: savedResponse(id, record) });
  }

  const id = getSystemId(body?.id ?? url.searchParams.get("id"));
  if (!id) return sendError(response, 400);
  if (path === "/api/community/system" || path === "/api/community/copy") {
    const system = publicRecordFromValue(read("publish", id));
    if (!system) return sendError(response, 404);
    if (method === "GET") return sendJson(response, 200, { system });
    const newId = randomUUID();
    const record = makePrivateSystem({
      schemaVersion: system.schemaVersion,
      name: `${system.name.slice(0, 74).trim()} copy`,
      description: system.description,
      wizard: { ...system.wizard, projectDescription: system.description, selectedColors: { primary: system.tokens.colors.primary, secondary: system.tokens.colors.secondary, accent: system.tokens.colors.accent } },
      tokens: system.tokens,
      components: system.components,
      editor: { previewDevice: "phone" },
    }, {
      uid, now: Date.now(),
      source: { type: "copy", systemId: id, systemName: system.name, creatorId, creatorName },
    });
    write("save", newId, record);
    return sendJson(response, 201, { system: savedResponse(newId, record) });
  }

  const existing = read("save", id);
  if (!existing) return sendError(response, 404);
  if (path === "/api/systems/publish") {
    const publishedAt = read("publish", id)?.publishedAt ?? Date.now();
    write("publish", id, publicSystemProjection(existing, id, creatorId, creatorName, publishedAt));
  } else if (path === "/api/systems/unpublish") {
    rmSync(file("publish", id), { force: true });
  } else if (method === "DELETE") {
    rmSync(file("publish", id), { force: true });
    rmSync(file("save", id), { force: true });
    return sendJson(response, 200, { ok: true, id });
  } else if (method === "PUT") {
    const record = makePrivateSystem(systemInputFromRequest(body), { uid, now: Date.now(), existing });
    write("save", id, record);
    return sendJson(response, 200, { system: savedResponse(id, record) });
  }
  return sendJson(response, 200, { system: savedResponse(id, existing) });
}

createServer(async (request, response) => {
  try {
    const host = request.headers.host;
    if (![`localhost:${port}`, `127.0.0.1:${port}`].includes(host)) return sendError(response, 403);
    const url = new URL(request.url, `http://${host}`);
    if (url.origin !== `http://${host}`) return sendError(response, 403);
    const allowed = methods.get(url.pathname);
    if (allowed) {
      if (!requireMethod(request, response, allowed)) return;
      const mutation = request.method !== "GET";
      if (mutation && request.headers.origin !== url.origin) return sendError(response, 403);
      const hasBody = ["POST", "PUT"].includes(request.method);
      const body = hasBody ? await readRequest(request, response) : null;
      if (hasBody && !body) return;
      return handleApi(request, response, url, body);
    }

    const path = ["/", "/community"].includes(url.pathname) ? "/index.html" : url.pathname;
    if (!staticFiles.has(path)) return sendError(response, 404);
    if (!requireMethod(request, response, ["GET", "HEAD"])) return;
    const content = readFileSync(new URL(path.slice(1), project), "utf8");
    const isHtml = path === "/index.html";
    response.setHeader("Content-Type", isHtml ? "text/html; charset=utf-8" : "text/javascript; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");
    response.end(isHtml
      ? content.replace("<body>", '<body data-local-workspace="">')
        .replace(/<script src="https:\/\/www\.gstatic\.com\/firebasejs\/[^"]+"><\/script>/g, "")
      : content);
  } catch (error) {
    if (error instanceof InvalidSystemError || error.message === "invalid-system-fields") return sendError(response, 400);
    console.error(error);
    return sendError(response, 500);
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`DSGen is running at http://localhost:${port}/ (Community: /community)`);
  console.log(`Local JSON files: ${fileURLToPath(new URL(".local-data/", project))}`);
});
