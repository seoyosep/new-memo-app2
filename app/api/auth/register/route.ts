import { NextResponse } from "next/server";
import { z } from "zod";
import { attachSessionCookie, hashPassword } from "@/lib/auth";
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
  if (!parsed.success) return NextResponse.redirect(absolutePathUrl("/register?error=invalid", request));

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.redirect(absolutePathUrl("/register?error=exists", request));

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: { email: parsed.data.email, passwordHash }
  });

  const res = NextResponse.redirect(absolutePathUrl("/memo", request));
  attachSessionCookie(res, user.id);
  return res;
}
