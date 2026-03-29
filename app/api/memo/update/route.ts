import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { absolutePathUrl } from "@/lib/site-url";

const schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(5000)
});

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.redirect(new URL("/login", request.url));

  const formData = await request.formData();
  const parsed = schema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content")
  });
  if (!parsed.success) return NextResponse.redirect(absolutePathUrl("/memo?error=update", request));

  await prisma.memo.updateMany({
    where: { id: parsed.data.id, userId },
    data: { title: parsed.data.title, content: parsed.data.content }
  });
  revalidatePath("/memo");
  return NextResponse.redirect(absolutePathUrl("/memo", request));
}
