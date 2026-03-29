import { NextResponse } from "next/server";
import { z } from "zod";
import { attachSessionCookie, getAuthEnvIssue, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  const envIssue = getAuthEnvIssue();
  if (envIssue) {
    console.error("[api/auth/register] missing env:", envIssue);
    const q =
      envIssue === "database" ? "config-db" : envIssue === "direct" ? "config-direct" : "config-session";
    return NextResponse.redirect(new URL(`/register?error=${q}`, request.url));
  }

  try {
    const formData = await request.formData();
    const parsed = schema.safeParse({
      email: formData.get("email"),
      password: formData.get("password")
    });
    if (!parsed.success) return NextResponse.redirect(new URL("/register?error=invalid", request.url));

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return NextResponse.redirect(new URL("/register?error=exists", request.url));

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: { email: parsed.data.email, passwordHash }
    });

    const res = NextResponse.redirect(new URL("/memo", request.url));
    attachSessionCookie(res, user.id);
    return res;
  } catch (e) {
    console.error("[api/auth/register]", e);
    return NextResponse.redirect(new URL("/register?error=server", request.url));
  }
}
