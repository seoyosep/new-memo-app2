"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const memoSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다.").max(100, "제목은 100자 이하여야 합니다."),
  content: z.string().min(1, "내용은 필수입니다.").max(5000, "내용이 너무 깁니다.")
});

export type MemoActionState = {
  error?: string;
};

export async function createMemoAction(
  _prevState: MemoActionState,
  formData: FormData
): Promise<MemoActionState> {
  const userId = await requireAuth();
  const parsed = memoSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "메모 생성에 실패했습니다." };
  }

  await prisma.memo.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      userId
    }
  });

  revalidatePath("/memo");
  return {};
}

export async function updateMemoAction(formData: FormData) {
  const userId = await requireAuth();

  const id = Number(formData.get("id"));
  const parsed = memoSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content")
  });

  if (!id || !parsed.success) return;

  await prisma.memo.updateMany({
    where: {
      id,
      userId
    },
    data: {
      title: parsed.data.title,
      content: parsed.data.content
    }
  });

  revalidatePath("/memo");
}

export async function deleteMemoAction(formData: FormData) {
  const userId = await requireAuth();
  const id = Number(formData.get("id"));
  if (!id) return;

  await prisma.memo.deleteMany({
    where: {
      id,
      userId
    }
  });

  revalidatePath("/memo");
}
