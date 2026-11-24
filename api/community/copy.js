import { getFirebaseServices } from "../../lib/firebase-admin.js";
import { requireFirebaseUser } from "../../lib/api-auth.js";
import { InvalidSystemError, makePrivateSystem } from "../../lib/design-systems.js";
import { getSystemId, logSafeError, readJsonBody, requireJsonContentType, requireMethod, sendError, sendJson } from "../../lib/http.js";
import { allowRequest } from "../../lib/rate-limit.js";
import { toPrivateResponse } from "../../lib/system-records.js";

export default async function handler(request, response) {
  if (!requireMethod(request, response, "POST")) return;
  const user = await requireFirebaseUser(request, response, { mutation: true });
  if (!user || !allowRequest(request, response, `copy:${user.uid}`, 20)) return;
  if (!requireJsonContentType(request, response)) return;
  const body = readJsonBody(request, response, 8 * 1024);
  if (!body) return;
  if (Object.keys(body).some((key) => key !== "id")) return sendError(response, 400);
  const sourceId = getSystemId(body.id);
  if (!sourceId) return sendError(response, 400);

  try {
    const { database } = getFirebaseServices();
    const snapshot = await database.ref(`publicSystems/${sourceId}`).once("value");
    const source = snapshot.val();
    if (!source || source.status !== "published") return sendError(response, 404);
    const input = {
      schemaVersion: source.schemaVersion,
      name: `${String(source.name).slice(0, 74).trim()} copy`,
      description: source.description,
      wizard: {
        platform: source.wizard.platform,
        styles: source.wizard.styles,
        customStyleDescription: source.wizard.customStyleDescription ?? "",
        projectDescription: source.description,
        ...(source.wizard.presetId ? { presetId: source.wizard.presetId } : {}),
        selectedColors: {
          primary: source.tokens.colors.primary,
          secondary: source.tokens.colors.secondary,
          accent: source.tokens.colors.accent,
        },
      },
      tokens: source.tokens,
      components: source.components,
      editor: { previewDevice: "phone" },
    };
    const collection = database.ref(`users/${user.uid}/systems`);
    const ref = collection.push();
    const record = makePrivateSystem(input, {
      uid: user.uid,
      now: Date.now(),
      source: {
        type: "copy",
        systemId: sourceId,
        systemName: source.name,
        creatorId: source.creatorId,
        creatorName: source.creatorName,
      },
    });
    await ref.set(record);
    return sendJson(response, 201, { system: toPrivateResponse(ref.key, record) });
  } catch (error) {
    if (error instanceof InvalidSystemError) return sendError(response, 400);
    logSafeError("community-copy", error);
    return sendError(response, 500);
  }
}
