const errorMessages = new Map([
  [400, "The request is invalid."],
  [401, "Sign in to continue."],
  [403, "This request is not allowed."],
  [404, "The requested item was not found."],
  [405, "Method not allowed."],
  [413, "The request is too large."],
  [415, "Send a JSON request."],
  [429, "Too many requests. Please try again shortly."],
  [500, "Something went wrong. Please try again."],
  [503, "This feature is temporarily unavailable."],
]);

export function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.end(JSON.stringify(body));
}

export function sendError(response, status, message = errorMessages.get(status) ?? errorMessages.get(500)) {
  return sendJson(response, status, { error: message });
}

export function logSafeError(event, error) {
  const code = typeof error?.code === "string" && /^[a-z0-9/_-]{1,80}$/i.test(error.code)
    ? error.code
    : "unexpected";
  console.error(`[${event}] ${code}`);
}

export function isTrustedOrigin(request) {
  const origin = request.headers?.origin;
  if (typeof origin !== "string") {
    return false;
  }

  if (process.env.APP_ORIGIN && origin === process.env.APP_ORIGIN) {
    return true;
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  try {
    const url = new URL(origin);
    return (
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname) &&
      ["3000", "8000"].includes(url.port)
    );
  } catch {
    return false;
  }
}

export function requireMethod(request, response, method) {
  const allowed = Array.isArray(method) ? method : [method];
  if (allowed.includes(request.method)) {
    return true;
  }
  response.setHeader("Allow", allowed.join(", "));
  sendError(response, 405);
  return false;
}

export function requireJsonContentType(request, response) {
  const value = request.headers?.["content-type"] ?? request.headers?.["Content-Type"];
  if (typeof value === "string" && /^application\/json(?:\s*;|$)/i.test(value)) return true;
  sendError(response, 415);
  return false;
}

export function readJsonBody(request, response, maxBytes = 64 * 1024) {
  const headerLength = Number(request.headers?.["content-length"] ?? request.headers?.["Content-Length"]);
  if (Number.isFinite(headerLength) && headerLength > maxBytes) {
    sendError(response, 413);
    return null;
  }

  let body = request.body;
  if (typeof body === "string") {
    if (Buffer.byteLength(body, "utf8") > maxBytes) {
      sendError(response, 413);
      return null;
    }
    try {
      body = JSON.parse(body);
    } catch {
      sendError(response, 400);
      return null;
    }
  } else if (body !== undefined) {
    try {
      if (Buffer.byteLength(JSON.stringify(body), "utf8") > maxBytes) {
        sendError(response, 413);
        return null;
      }
    } catch {
      sendError(response, 400);
      return null;
    }
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    sendError(response, 400);
    return null;
  }
  return body;
}

export function getSystemId(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(value) ? value : null;
}
