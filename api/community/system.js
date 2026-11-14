import { getFirebaseServices } from "../../lib/firebase-admin.js";
import { getSystemId, logSafeError, requireMethod, sendError, sendJson } from "../../lib/http.js";
import { allowRequest, requestAddressKey } from "../../lib/rate-limit.js";
import { publicRecordFromValue } from "../../lib/system-records.js";

function requestedId(request) {
  if (typeof request.query?.id === "string") return request.query.id;
  try { return new URL(request.url, "http://localhost").searchParams.get("id"); } catch { return null; }
}

export default async function handler(request, response) {
  if (!requireMethod(request, response, "GET")) return;
  const id = getSystemId(requestedId(request));
  if (!id) return sendError(response, 400);
  if (!allowRequest(request, response, `community:${requestAddressKey(request)}`, 120)) return;
  try {
    const { database } = getFirebaseServices();
    const snapshot = await database.ref(`publicSystems/${id}`).once("value");
    const system = publicRecordFromValue(snapshot.val());
    if (!system) return sendError(response, 404);
    return sendJson(response, 200, { system });
  } catch (error) {
    logSafeError("community-system", error);
    return sendError(response, 500);
  }
}
