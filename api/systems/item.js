import { getFirebaseServices } from "../../lib/firebase-admin.js";
import { requireFirebaseUser } from "../../lib/api-auth.js";
import { creatorIdForUid, InvalidSystemError, makePrivateSystem, publicSystemProjection } from "../../lib/design-systems.js";
import { getSystemId, logSafeError, readJsonBody, requireJsonContentType, requireMethod, sendError, sendJson } from "../../lib/http.js";
import { systemInputFromRequest, toPrivateResponse } from "../../lib/system-records.js";
import { allowRequest } from "../../lib/rate-limit.js";

function requestedId(request) {
  if (typeof request.query?.id === "string") return request.query.id;
  try {
    return new URL(request.url, "http://localhost").searchParams.get("id");
  } catch {
    return null;
  }
}

export default async function handler(request, response) {
  if (!requireMethod(request, response, ["GET", "PUT", "DELETE"])) return;
  const id = getSystemId(requestedId(request));
  if (!id) return sendError(response, 400);
  const mutation = request.method !== "GET";
  const user = await requireFirebaseUser(request, response, { mutation });
  if (!user) return;
  if (!allowRequest(request, response, `system:${user.uid}`, mutation ? 30 : 90)) return;

  let body = null;
  if (request.method === "PUT") {
    if (!requireJsonContentType(request, response)) return;
    body = readJsonBody(request, response);
    if (!body) return;
  }

  try {
    const { database } = getFirebaseServices();
    const recordRef = database.ref(`users/${user.uid}/systems/${id}`);
    const snapshot = await recordRef.once("value");
    const existing = snapshot.val();
    if (!existing) return sendError(response, 404);

    if (request.method === "GET") {
      return sendJson(response, 200, { system: toPrivateResponse(id, existing) });
    }

    if (request.method === "DELETE") {
      const updates = { [`users/${user.uid}/systems/${id}`]: null };
      if (existing.sharing?.status === "published") {
        const creatorId = creatorIdForUid(user.uid);
        updates[`publicSystems/${id}`] = null;
        updates[`publicCreators/${creatorId}/systems/${id}`] = null;
      }
      await database.ref().update(updates);
      return sendJson(response, 200, { ok: true, id });
    }

    const input = systemInputFromRequest(body);
    const now = Date.now();
    const record = makePrivateSystem(input, { uid: user.uid, now, existing });
    if (existing.creatorName) record.creatorName = existing.creatorName;
    const updates = { [`users/${user.uid}/systems/${id}`]: record };
    if (existing.sharing?.status === "published") {
      const creatorId = creatorIdForUid(user.uid);
      updates[`publicSystems/${id}`] = publicSystemProjection(
        record, id, creatorId, existing.creatorName || user.name || "DSGen creator", existing.sharing.publishedAt ?? now,
      );
    }
    await database.ref().update(updates);
    return sendJson(response, 200, { system: toPrivateResponse(id, record) });
  } catch (error) {
    if (error instanceof InvalidSystemError || error?.message === "invalid-system-fields") {
      return sendError(response, 400);
    }
    logSafeError("system-item", error);
    return sendError(response, 500);
  }
}
