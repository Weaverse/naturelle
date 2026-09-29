export function isSameOriginPost(request: Request) {
  if (request.method.toUpperCase() !== "POST") {
    return false;
  }
  const origin = request.headers.get("Origin");
  if (!origin) {
    return false;
  }
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
