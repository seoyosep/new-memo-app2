import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  id: z.coerce.number().int().positive()
});

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.redirect(new URL("/login", request.url));

  const formData = await request.formData();
  const parsed = schema.safeParse({ id: formData.get("id") });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/memo?error=delete", request.url));
  }

  await prisma.memo.deleteMany({
    where: { id: parsed.data.id, userId }
  });

  revalidatePath("/memo");
  return NextResponse.redirect(new URL("/memo", request.url));
}
