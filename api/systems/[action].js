import publish from "../../lib/sharing/publish.js";
import unpublish from "../../lib/sharing/unpublish.js";
import { sendError } from "../../lib/http.js";

export default function handler(request, response) {
  const pathname = new URL(request.url, "http://localhost").pathname.replace(/\/$/, "");
  if (pathname === "/api/systems/publish") return publish(request, response);
  if (pathname === "/api/systems/unpublish") return unpublish(request, response);
  return sendError(response, 404);
}
