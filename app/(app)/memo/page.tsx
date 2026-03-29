import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MemoPage() {
  const userId = await requireAuth();
  const memos = await prisma.memo.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-4xl space-y-6 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-35 [background-image:radial-gradient(circle_at_1px_1px,var(--color-accent)_1px,transparent_0)] [background-size:24px_24px]" />
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">내 메모</h1>
        <form action="/api/auth/logout" method="post">
          <Button type="submit" variant="outline">
            로그아웃
          </Button>
        </form>
      </header>

      <Card className="border-primary/30 shadow-lg">
        <CardHeader>
          <CardTitle>새 메모 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/memo/create" method="post" className="space-y-3">
            <Input name="title" placeholder="제목" required />
            <Textarea name="content" placeholder="내용" required className="min-h-32" />
            <Button type="submit">메모 추가</Button>
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-4">
        {memos.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">아직 메모가 없습니다.</CardContent>
          </Card>
        ) : (
          memos.map((memo) => (
            <Card key={memo.id} className="border-secondary/40 shadow-md">
              <CardContent className="pt-6">
                <form action="/api/memo/update" method="post" className="space-y-3">
                  <input type="hidden" name="id" value={memo.id} />
                  <Input name="title" defaultValue={memo.title} required />
                  <Textarea name="content" defaultValue={memo.content} required />
                  <div className="flex items-center gap-2">
                    <Button type="submit" size="sm">
                      수정
                    </Button>
                  </div>
                </form>
                <form action="/api/memo/delete" method="post" className="mt-2">
                  <input type="hidden" name="id" value={memo.id} />
                  <div className="flex items-center gap-2">
                    <Button type="submit" variant="destructive" size="sm">
                      삭제
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}
