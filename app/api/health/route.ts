import { NextResponse } from "next/server";
import { getAuthEnvIssue } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** 배포 진단용 — 브라우저에서 열면 JSON (비밀값 노출 없음) */
export async function GET() {
  const envIssue = getAuthEnvIssue();
  const env = {
    hasDatabaseUrl: !!process.env.DATABASE_URL?.trim(),
    hasDirectUrl: !!process.env.DIRECT_URL?.trim(),
    sessionSecretOk: !!(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16),
    issue: envIssue
  };

  if (envIssue) {
    return NextResponse.json(
      {
        ok: false,
        env,
        db: { connected: false },
        hint: "Vercel Environment Variables + Redeploy 확인. 값에 따옴표 넣지 말 것."
      },
      { status: 503 }
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      env,
      db: { connected: true }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/health]", e);
    return NextResponse.json(
      {
        ok: false,
        env,
        db: { connected: false, error: message },
        hint: "Supabase 프로젝트 일시정지·비밀번호·방화벽·URL 인코딩 확인"
      },
      { status: 503 }
    );
  }
}
