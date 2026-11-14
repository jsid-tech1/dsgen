import { getFirebaseServices } from "../../lib/firebase-admin.js";
import { logSafeError, requireMethod, sendError, sendJson } from "../../lib/http.js";
import { allowRequest, requestAddressKey } from "../../lib/rate-limit.js";
import { publicRecordFromValue } from "../../lib/system-records.js";

function requestedCreatorId(request) {
  const value = typeof request.query?.id === "string"
    ? request.query.id
    : new URL(request.url, "http://localhost").searchParams.get("id");
  return typeof value === "string" && /^[a-f0-9]{24}$/.test(value) ? value : null;
}

export default async function handler(request, response) {
  if (!requireMethod(request, response, "GET")) return;
  let creatorId;
  try { creatorId = requestedCreatorId(request); } catch { creatorId = null; }
  if (!creatorId) return sendError(response, 400);
  if (!allowRequest(request, response, `community:${requestAddressKey(request)}`, 90)) return;
  try {
    const { database } = getFirebaseServices();
    const snapshot = await database.ref(`publicCreators/${creatorId}`).once("value");
    const profile = snapshot.val();
    if (!profile || typeof profile.creatorName !== "string") return sendError(response, 404);
    const ids = Object.keys(profile.systems ?? {}).slice(0, 50);
    const records = await Promise.all(ids.map((id) => database.ref(`publicSystems/${id}`).once("value")));
    const systems = records.map((record) => publicRecordFromValue(record.val()))
      .filter((system) => system && system.creatorId === creatorId)
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
    if (!systems.length) return sendError(response, 404);
    return sendJson(response, 200, {
      creator: { id: creatorId, name: profile.creatorName.slice(0, 100) },
      systems,
    });
  } catch (error) {
    logSafeError("community-creator", error);
    return sendError(response, 500);
  }
}
