import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
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

  await createSession(user.id);
  return NextResponse.redirect(new URL("/memo", request.url));
}
