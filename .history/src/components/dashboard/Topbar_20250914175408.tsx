"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardTopbar({
  companyName,
  balance,
  level,
  progress,          // 0..1
  xpIntoLevel,       // optionnel: affichage "230/1000"
  xpForNext,         // optionnel
}: {
  companyName: string | null;
  balance: number | null;
  level?: number | null;
  progress?: number | null;
  xpIntoLevel?: number | null;
  xpForNext?: number | null;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const fmt = (n: number | null | undefined) =>
    typeof n === "number" ? n.toLocaleString("fr-FR") : "—";

  const pct = Math.round(((progress ?? 0) * 100));

  const onSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST", cache: "no-store" });
    } finally {
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-sm text-white/80">
        <span>{companyName ? `Bienvenue, ${companyName}` : "Bienvenue"}</span>

        {/* Solde */}
        <span className="ml-1 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-2 py-1">
          <span className="text-white/70">Solde:</span>
          <span className="font-semibold">€ {fmt(balance)}</span>
        </span>

        {/* Niveau + barre */}
        <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-2 py-1">
          <span className="font-semibold">Niv. {level ?? "—"}</span>
          <span className="relative inline-block h-2 w-32 rounded-full bg-white/10 overflow-hidden">
            <span
              className="absolute left-0 top-0 h-full rounded-full bg-white/70"
              style={{ width: `${pct}%` }}
            />
          </span>
          {typeof xpIntoLevel === "number" && typeof xpForNext === "number" && (
            <span className="text-white/70">{xpIntoLevel}/{xpForNext}</span>
          )}
        </span>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        disabled={signingOut}
        className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-60"
      >
        {signingOut ? "Déconnexion…" : "Se déconnecter"}
      </button>
    </div>
  );
}
