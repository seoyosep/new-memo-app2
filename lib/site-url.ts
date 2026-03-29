/**
 * 리버스 프록시·Vercel 등에서 request.url 의 호스트가 내부 값으로 잡히는 경우를 피하기 위해
 * 리다이렉트 Location 에 쓸 공개 origin 을 만든다.
 */
export function getRequestOrigin(request: Request): string {
  try {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host =
      forwardedHost?.split(",")[0]?.trim() || request.headers.get("host")?.trim();
    if (host) {
      const forwardedProto = request.headers.get("x-forwarded-proto");
      const proto =
        forwardedProto?.split(",")[0]?.trim() ||
        (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
      return `${proto}://${host}`;
    }
    return new URL(request.url).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export function absolutePathUrl(path: string, request: Request): URL {
  const p = path.startsWith("/") ? path : `/${path}`;
  return new URL(p, getRequestOrigin(request));
}
