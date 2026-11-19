import { getFirebaseServices } from "../../lib/firebase-admin.js";
import { logSafeError, requireMethod, sendError, sendJson } from "../../lib/http.js";
import { allowRequest, requestAddressKey } from "../../lib/rate-limit.js";
import { publicRecordFromValue } from "../../lib/system-records.js";

export default async function handler(request, response) {
  if (!requireMethod(request, response, "GET")) return;
  if (!allowRequest(request, response, `community:${requestAddressKey(request)}`, 90)) return;
  try {
    const { database } = getFirebaseServices();
    const snapshot = await database.ref("publicSystems").orderByChild("publishedAt").limitToLast(100).once("value");
    const systems = Object.entries(snapshot.val() ?? {})
      .map(([id, value]) => publicRecordFromValue({ ...value, id }))
      .filter(Boolean)
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
    return sendJson(response, 200, { systems });
  } catch (error) {
    logSafeError("community-gallery", error);
    return sendError(response, 500);
  }
}
