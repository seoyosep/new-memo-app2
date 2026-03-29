import { NextResponse } from "next/server";
import { z } from "zod";
import { attachSessionCookie, getAuthEnvIssue, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  const envIssue = getAuthEnvIssue();
  if (envIssue) {
    console.error("[api/auth/login] missing env:", envIssue);
    const q =
      envIssue === "database" ? "config-db" : envIssue === "direct" ? "config-direct" : "config-session";
    return NextResponse.redirect(new URL(`/login?error=${q}`, request.url));
  }

  try {
    const formData = await request.formData();
    const parsed = schema.safeParse({
      email: formData.get("email"),
      password: formData.get("password")
    });
    if (!parsed.success) return NextResponse.redirect(new URL("/login?error=invalid", request.url));

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) return NextResponse.redirect(new URL("/login?error=invalid-credentials", request.url));

    const ok = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!ok) return NextResponse.redirect(new URL("/login?error=invalid-credentials", request.url));

    const res = NextResponse.redirect(new URL("/memo", request.url));
    attachSessionCookie(res, user.id);
    return res;
  } catch (e) {
    console.error("[api/auth/login]", e);
    return NextResponse.redirect(new URL("/login?error=server", request.url));
  }
}
