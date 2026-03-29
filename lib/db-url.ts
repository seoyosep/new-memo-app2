/** Vercel 서버리스 + Supabase 풀러용 런타임 URL 보강 */
export function prismaRuntimeDatabaseUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (!u.searchParams.has("connection_limit")) {
      u.searchParams.set("connection_limit", "1");
    }
    if (u.port === "6543" && !u.searchParams.has("pgbouncer")) {
      u.searchParams.set("pgbouncer", "true");
    }
    return u.toString();
  } catch {
    return raw;
  }
}
