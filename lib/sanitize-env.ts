/** Vercel/복붙 시 값 앞뒤 따옴표·공백 제거 */
export function sanitizeServerEnv(): void {
  for (const key of ["DATABASE_URL", "DIRECT_URL", "SESSION_SECRET"] as const) {
    const v = process.env[key];
    if (v === undefined) continue;
    let t = v.trim();
    if (
      (t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith("'") && t.endsWith("'"))
    ) {
      t = t.slice(1, -1).trim();
    }
    process.env[key] = t;
  }
}
