import { NextResponse } from "next/server";
import { z } from "zod";
import { attachSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { absolutePathUrl } from "@/lib/site-url";

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
  if (!parsed.success) return NextResponse.redirect(absolutePathUrl("/login?error=invalid", request));

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return NextResponse.redirect(absolutePathUrl("/login?error=invalid-credentials", request));

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.redirect(absolutePathUrl("/login?error=invalid-credentials", request));

  const res = NextResponse.redirect(absolutePathUrl("/memo", request));
  attachSessionCookie(res, user.id);
  return res;
}
