import { publicSystemProjection, publicSystemResponse } from "./design-systems.js";

export function systemInputFromRequest(body) {
  const allowed = ["schemaVersion", "name", "description", "wizard", "tokens", "components", "editor"];
  if (Object.keys(body).some((key) => !allowed.includes(key))) {
    throw new Error("invalid-system-fields");
  }
  return {
    schemaVersion: body.schemaVersion,
    name: body.name,
    description: body.description,
    wizard: body.wizard,
    tokens: body.tokens,
    components: body.components,
    editor: body.editor,
  };
}

export function toPrivateResponse(id, value) {
  if (!value || typeof value !== "object") return null;
  return {
    id,
    schemaVersion: value.schemaVersion,
    name: value.name,
    description: value.description,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    wizard: value.wizard,
    tokens: value.tokens,
    components: value.components,
    editor: value.editor,
    sharing: value.sharing ?? { visibility: "private", status: "draft", publishedAt: null },
    source: value.source ?? { type: "original", systemId: null, creatorId: null, creatorName: null },
  };
}

export function writePublishedProjection(rootUpdates, uid, id, system, creatorName, creatorId) {
  const publishedAt = system.sharing?.publishedAt ?? Date.now();
  const publicRecord = publicSystemProjection(system, id, creatorId, creatorName, publishedAt);
  rootUpdates[`users/${uid}/systems/${id}`] = {
    ...system,
    creatorName,
    sharing: { visibility: "public", status: "published", publishedAt },
    updatedAt: Date.now(),
  };
  rootUpdates[`publicSystems/${id}`] = publicRecord;
  rootUpdates[`publicCreators/${creatorId}/creatorName`] = creatorName;
  rootUpdates[`publicCreators/${creatorId}/systems/${id}`] = true;
}

export function publicRecordFromValue(value) {
  return publicSystemResponse(value);
}
