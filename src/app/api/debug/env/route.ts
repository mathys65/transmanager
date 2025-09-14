export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET() {
  const playFabId = cookies().get("playfab_id")?.value || null;
  return NextResponse.json({
    haveTitleId: !!process.env.PLAYFAB_TITLE_ID,
    haveSecret:  !!process.env.PLAYFAB_DEV_SECRET_KEY,
    playFabIdPresent: !!playFabId
  });
}
