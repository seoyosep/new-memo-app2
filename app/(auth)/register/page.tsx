import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function RegisterPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage =
    error === "exists"
      ? "이미 사용 중인 이메일입니다."
      : error === "invalid"
        ? "입력값을 확인해주세요."
        : "";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,var(--color-secondary)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-card/90 p-4 shadow-2xl backdrop-blur">
        <Card>
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
            <CardDescription>새 계정을 만들어 메모를 관리하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/auth/register" method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" name="email" type="email" placeholder="email@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" name="password" type="password" required minLength={6} />
              </div>
              {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
              <Button type="submit" className="w-full">
                회원가입
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="font-medium text-primary underline underline-offset-4">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
