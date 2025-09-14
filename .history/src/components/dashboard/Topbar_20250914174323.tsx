// src/components/dashboard/Topbar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardTopbar({
  companyName,
  balance,
}: {
  companyName: string | null;
  balance: number | null;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fmt = (n: number | null | undefined) =>
    typeof n === "number" ? n.toLocaleString("fr-FR") : "—";

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // force revalidation côté client
      router.refresh();
    } finally {
      setRefreshing(false);
    }
  };

  const onSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST", cache: "no-store" });
    } finally {
      // on coupe l’accès au dashboard immédiatement
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-white/80">
        {companyName ? `Bienvenue, ${companyName}` : "Bienvenue"}
        <span className="ml-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-2 py-1">
          <span className="text-white/70">Solde:</span>
          <span className="font-semibold">€ {fmt(balance)}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-60"
        >
          {refreshing ? "Rafraîchir…" : "Rafraîchir"}
        </button>

        <button
          type="button"
          onClick={onSignOut}
          disabled={signingOut}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-60"
        >
          {signingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </div>
    </div>
  );
}
