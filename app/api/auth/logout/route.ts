import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { absolutePathUrl } from "@/lib/site-url";

export async function POST(request: Request) {
  const res = NextResponse.redirect(absolutePathUrl("/login", request));
  clearSessionCookie(res);
  return res;
}
