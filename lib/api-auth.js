import { getFirebaseServices } from "./firebase-admin.js";
import { isTrustedOrigin, logSafeError, sendError } from "./http.js";

export async function requireFirebaseUser(request, response, { mutation = false } = {}) {
  if (mutation && !isTrustedOrigin(request)) {
    sendError(response, 403);
    return null;
  }

  const authorization = request.headers?.authorization ?? request.headers?.Authorization;
  const match = typeof authorization === "string"
    ? authorization.match(/^Bearer ([A-Za-z0-9._-]{20,8192})$/)
    : null;
  if (!match) {
    sendError(response, 401);
    return null;
  }

  try {
    const { auth } = getFirebaseServices();
    const decoded = await auth.verifyIdToken(match[1], true);
    if (typeof decoded.uid !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(decoded.uid)) {
      sendError(response, 401);
      return null;
    }
    return {
      uid: decoded.uid,
      name: typeof decoded.name === "string" ? decoded.name.slice(0, 100) : "",
    };
  } catch (error) {
    const invalidTokenCodes = new Set([
      "auth/argument-error",
      "auth/id-token-expired",
      "auth/id-token-revoked",
      "auth/invalid-id-token",
      "auth/invalid-credential",
    ]);
    if (invalidTokenCodes.has(error?.code)) {
      sendError(response, 401);
      return null;
    }
    logSafeError("firebase-token-verification", error);
    sendError(response, 500);
    return null;
  }
}
