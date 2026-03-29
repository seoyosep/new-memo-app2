import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage =
    error === "invalid-credentials" || error === "invalid"
      ? "이메일 또는 비밀번호가 올바르지 않습니다."
      : "";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,var(--color-primary)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-card/90 p-4 shadow-2xl backdrop-blur">
        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>메모 앱을 사용하려면 로그인하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/auth/login" method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" name="email" type="email" placeholder="email@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          아직 계정이 없나요?{" "}
          <Link href="/register" className="font-medium text-primary underline underline-offset-4">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
