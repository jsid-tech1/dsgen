import { getFirebaseServices } from "../../lib/firebase-admin.js";
import { requireFirebaseUser } from "../../lib/api-auth.js";
import { makePrivateSystem, InvalidSystemError } from "../../lib/design-systems.js";
import { logSafeError, readJsonBody, requireJsonContentType, requireMethod, sendError, sendJson } from "../../lib/http.js";
import { systemInputFromRequest, toPrivateResponse } from "../../lib/system-records.js";
import { allowRequest } from "../../lib/rate-limit.js";

export default async function handler(request, response) {
  if (!requireMethod(request, response, ["GET", "POST"])) return;
  const mutation = request.method === "POST";
  const user = await requireFirebaseUser(request, response, { mutation });
  if (!user) return;
  if (!allowRequest(request, response, `systems:${user.uid}`, mutation ? 30 : 90)) return;

  if (!mutation) {
    try {
      const { database } = getFirebaseServices();
      const snapshot = await database.ref(`users/${user.uid}/systems`)
        .orderByChild("updatedAt").limitToLast(100).once("value");
      const records = snapshot.val() ?? {};
      const systems = Object.entries(records)
        .map(([id, value]) => toPrivateResponse(id, value))
        .filter(Boolean)
        .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
      return sendJson(response, 200, { systems });
    } catch (error) {
      logSafeError("systems-list", error);
      return sendError(response, 500);
    }
  }

  if (!requireJsonContentType(request, response)) return;
  const body = readJsonBody(request, response);
  if (!body) return;

  try {
    const input = systemInputFromRequest(body);
    const { database } = getFirebaseServices();
    const collection = database.ref(`users/${user.uid}/systems`);
    const recordRef = collection.push();
    const record = makePrivateSystem(input, { uid: user.uid, now: Date.now() });
    await recordRef.set(record);
    return sendJson(response, 201, { system: toPrivateResponse(recordRef.key, record) });
  } catch (error) {
    if (error instanceof InvalidSystemError || error?.message === "invalid-system-fields") {
      return sendError(response, 400);
    }
    logSafeError("systems-create", error);
    return sendError(response, 500);
  }
}
