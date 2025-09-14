import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/cookies";

const COOKIE_NAME = process.env.COOKIE_NAME || "tm_session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res, COOKIE_NAME);
  return res;
}
