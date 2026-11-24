import { getFirebaseServices } from "../firebase-admin.js";
import { requireFirebaseUser } from "../../lib/api-auth.js";
import { creatorIdForUid } from "../../lib/design-systems.js";
import { getSystemId, logSafeError, readJsonBody, requireJsonContentType, requireMethod, sendError, sendJson } from "../../lib/http.js";
import { allowRequest } from "../../lib/rate-limit.js";
import { toPrivateResponse } from "../../lib/system-records.js";

export default async function handler(request, response) {
  if (!requireMethod(request, response, "POST")) return;
  const user = await requireFirebaseUser(request, response, { mutation: true });
  if (!user || !allowRequest(request, response, `unpublish:${user.uid}`, 20)) return;
  if (!requireJsonContentType(request, response)) return;
  const body = readJsonBody(request, response, 8 * 1024);
  if (!body) return;
  if (Object.keys(body).some((key) => key !== "id")) return sendError(response, 400);
  const id = getSystemId(body.id);
  if (!id) return sendError(response, 400);

  try {
    const { database } = getFirebaseServices();
    const ref = database.ref(`users/${user.uid}/systems/${id}`);
    const snapshot = await ref.once("value");
    const current = snapshot.val();
    if (!current) return sendError(response, 404);

    const record = {
      ...current,
      sharing: { visibility: "private", status: "draft", publishedAt: null },
      updatedAt: Date.now(),
    };
    const updates = { [`users/${user.uid}/systems/${id}`]: record };
    if (current.sharing?.status === "published") {
      const creatorId = creatorIdForUid(user.uid);
      updates[`publicSystems/${id}`] = null;
      updates[`publicCreators/${creatorId}/systems/${id}`] = null;
    }
    await database.ref().update(updates);
    return sendJson(response, 200, { system: toPrivateResponse(id, record) });
  } catch (error) {
    logSafeError("system-unpublish", error);
    return sendError(response, 500);
  }
}
