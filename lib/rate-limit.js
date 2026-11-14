import { sendError } from "./http.js";

// Best-effort per-function-instance protection. Serverless instances do not share
// this state, so it supplements rather than replaces platform-level rate limits.
const buckets = new Map();
const windowMs = 60_000;
const maxEntries = 5000;

export function allowRequest(request, response, key, limit = 90) {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || now - bucket.start >= windowMs) {
    bucket = { start: now, count: 0 };
    buckets.set(key, bucket);
  }
  bucket.count += 1;

  if (buckets.size > maxEntries) {
    for (const [entryKey, entry] of buckets) {
      if (now - entry.start >= windowMs) buckets.delete(entryKey);
    }
  }
  if (bucket.count > limit) {
    response.setHeader("Retry-After", "60");
    sendError(response, 429);
    return false;
  }
  return true;
}

export function requestAddressKey(request) {
  const forwarded = request.headers?.["x-forwarded-for"];
  const address = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "unknown";
  return `ip:${address.slice(0, 80)}`;
}
