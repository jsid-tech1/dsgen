import { requireFirebaseUser } from "../lib/api-auth.js";
import { readJsonBody, requireJsonContentType, requireMethod, sendError, sendJson } from "../lib/http.js";
import { allowRequest } from "../lib/rate-limit.js";
import { projectKeywords } from "../lib/project-keywords.js";

export default async function handler(request, response) {
  if (!requireMethod(request, response, "POST") || !requireJsonContentType(request, response)) return;
  const user = await requireFirebaseUser(request, response, { mutation: true });
  if (!user || !allowRequest(request, response, "keywords:" + user.uid, 12)) return;
  const body = readJsonBody(request, response, 4096);
  if (!body) return;
  if (typeof body.description !== "string" || body.description.length > 300) return sendError(response, 400);
  return sendJson(response, 200, { keywords: await projectKeywords(body.description) });
}
