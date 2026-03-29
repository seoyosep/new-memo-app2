import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { absolutePathUrl } from "@/lib/site-url";

const schema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(5000)
});

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.redirect(absolutePathUrl("/login", request));

  const formData = await request.formData();
  const parsed = schema.safeParse({
    title: formData.get("title"),
    content: formData.get("content")
  });
  if (!parsed.success) return NextResponse.redirect(new URL("/memo?error=create", request.url));

  await prisma.memo.create({
    data: { title: parsed.data.title, content: parsed.data.content, userId }
  });
  revalidatePath("/memo");
  return NextResponse.redirect(absolutePathUrl("/memo", request));
}
