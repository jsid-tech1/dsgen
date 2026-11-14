import test from "node:test";
import assert from "node:assert/strict";
import {
  creatorIdForUid,
  InvalidSystemError,
  makePrivateSystem,
  normalizeSystemInput,
  publicSystemProjection,
  publicSystemResponse,
} from "../lib/design-systems.js";
import { getSystemId, readJsonBody, requireJsonContentType, requireMethod } from "../lib/http.js";

function validInput() {
  return {
    schemaVersion: 1,
    name: "Accessible fitness app",
    description: "A fitness app for beginners.",
    wizard: {
      platform: "mobile",
      styles: ["Modern"],
      customStyleDescription: "",
      projectDescription: "A fitness app for beginners.",
      selectedColors: { primary: "#3854ef", secondary: "#70a4ff", accent: "#12a4a7" },
    },
    tokens: {
      colors: { primary: "#3854ef", secondary: "#70a4ff", accent: "#12a4a7", surface: "#eef0f7" },
      typography: { fontFamily: "Inter", scale: { body: 16, heading: 24, display: 32 } },
    },
    components: { buttons: ["Primary", "Secondary", "Tertiary"], cards: ["Default", "Featured"] },
    editor: { previewDevice: "phone" },
  };
}

function responseStub() {
  return {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    end(value) { this.body = value; },
  };
}

test("normalizes the current editor and wizard schema", () => {
  const result = normalizeSystemInput(validInput());
  assert.equal(result.name, "Accessible fitness app");
  assert.equal(result.tokens.colors.surface, "#eef0f7");
  assert.deepEqual(result.components.buttons, ["Primary", "Secondary", "Tertiary"]);
});

test("rejects unknown fields and invalid colors", () => {
  assert.throws(() => normalizeSystemInput({ ...validInput(), ownerUid: "attacker" }), InvalidSystemError);
  const invalid = validInput();
  invalid.tokens.colors.primary = "url(javascript:alert(1))";
  assert.throws(() => normalizeSystemInput(invalid), InvalidSystemError);
});

test("public projection is an allowlist and excludes owner/private fields", () => {
  const uid = "private-firebase-uid";
  const record = makePrivateSystem(validInput(), { uid, now: 1234 });
  const projection = publicSystemProjection(record, "system_1", creatorIdForUid(uid), "Alex Designer", 1234);
  const response = publicSystemResponse({
    ...projection,
    ownerUid: uid,
    email: "private@example.invalid",
    privateAccountNote: "never public",
  });
  assert.equal(response.creatorName, "Alex Designer");
  assert.equal("ownerUid" in response, false);
  assert.equal("email" in response, false);
  assert.equal("privateAccountNote" in response, false);
  assert.notEqual(response.creatorId, uid);
});

test("unpublished records are never returned by the public projection", () => {
  assert.equal(publicSystemResponse({ status: "draft" }), null);
});

test("system IDs reject path traversal and Firebase-invalid characters", () => {
  assert.equal(getSystemId("-Abc_123"), "-Abc_123");
  for (const id of ["../other", "a/b", "a.b", "#root", "", "a".repeat(129)]) {
    assert.equal(getSystemId(id), null);
  }
});

test("method and content-type helpers return safe errors", () => {
  const response = responseStub();
  assert.equal(requireMethod({ method: "PATCH" }, response, ["GET", "PUT"]), false);
  assert.equal(response.statusCode, 405);
  assert.deepEqual(JSON.parse(response.body), { error: "Method not allowed." });

  const typeResponse = responseStub();
  assert.equal(requireJsonContentType({ headers: { "content-type": "text/plain" } }, typeResponse), false);
  assert.equal(typeResponse.statusCode, 415);
});

test("JSON parser rejects malformed and oversized bodies", () => {
  const malformedResponse = responseStub();
  assert.equal(readJsonBody({ body: "{bad", headers: {} }, malformedResponse), null);
  assert.equal(malformedResponse.statusCode, 400);

  const tooLargeResponse = responseStub();
  assert.equal(readJsonBody({ body: { ok: true }, headers: { "content-length": "70000" } }, tooLargeResponse), null);
  assert.equal(tooLargeResponse.statusCode, 413);

  const goodResponse = responseStub();
  assert.deepEqual(readJsonBody({ body: "{\"ok\":true}", headers: {} }, goodResponse), { ok: true });
});
