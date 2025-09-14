import { NextResponse } from "next/server";

export function setSessionCookie(res: NextResponse, name: string, value: string) {
  const secure = process.env.COOKIE_SECURE === "1";
  res.cookies.set({
    name,
    value,
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
  return res;
}

export function clearSessionCookie(res: NextResponse, name: string) {
  const secure = process.env.COOKIE_SECURE === "1";
  res.cookies.set({
    name,
    value: "",
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
