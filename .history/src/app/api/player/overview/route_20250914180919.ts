import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPlayFabServer } from "@/lib/playfab/getPlayFabServer";

export async function GET() {
  try {
    const c = cookies();
    const playFabId = c.get("playfab_id")?.value;
    if (!playFabId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const Server = getPlayFabServer();

    // Lire Level et XP
    const statsRes: any = await new Promise((resolve, reject) => {
      Server.GetPlayerStatistics(
        { PlayFabId: playFabId, StatisticNames: ["Level", "XP"] },
        (err, res) => (err ? reject(err) : resolve(res))
      );
    });

    const statsMap = new Map(
      (statsRes?.data?.Statistics ?? []).map((s: any) => [s.StatisticName, s.Value])
    );
    const level = Number(statsMap.get("Level") ?? 1);
    const xp = Number(statsMap.get("XP") ?? 0);

    // Lire la LevelCurve (tableau JSON dans TitleData["LevelCurve"])
    const titleDataRes: any = await new Promise((resolve, reject) => {
      Server.GetTitleData({ Keys: ["LevelCurve"] }, (err, res) =>
        err ? reject(err) : resolve(res)
      );
    });

    const curveRaw = titleDataRes?.data?.Data?.LevelCurve;
    const curve: number[] = curveRaw ? JSON.parse(curveRaw) : [];

    const xpForNext = curve[level - 1] ?? 1000;
    const xpIntoLevel = xp % xpForNext;
    const progress = Math.max(
      0,
      Math.min(1, xpForNext ? xpIntoLevel / xpForNext : 0)
    );

    return NextResponse.json({
      level,
      xp,
      xpIntoLevel,
      xpForNext,
      progress,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Erreur interne" }, { status: 500 });
  }
}
