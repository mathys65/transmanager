// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardTopbar from "@/components/dashboard/Topbar";

function KpiCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm text-white/70">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-1 text-xs text-white/50">{sub}</div>}
    </div>
  );
}

type Overview = {
  companyName: string | null;
  balance: number | null; // attendu en "EU"
  fleetCount: number | null;
  warehousesActive: number | null;
  activeContracts: number | null;
  customerSatisfaction: number | null;
};

type BalanceResp = {
  balances: Record<string, number>;
  recharge?: Record<string, unknown>;
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [balanceRaw, setBalanceRaw] = useState<BalanceResp | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [seedLoading, setSeedLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      // 1) Overview agrégé
      const r1 = await fetch("/api/dashboard/overview", { cache: "no-store" });
      const j1 = await r1.json();
      if (!r1.ok) throw new Error(j1?.error || "Erreur overview");
      setOverview(j1 as Overview);

      // 2) Balance brute PlayFab (toutes devises renvoyées)
      const r2 = await fetch("/api/playfab/balance", { cache: "no-store" });
      const j2 = await r2.json();
      if (!r2.ok) throw new Error(j2?.error || "Erreur balance");
      setBalanceRaw(j2 as BalanceResp);
    } catch (e: any) {
      setErr(e?.message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      await load();
    })();
    return () => {
      alive = false;
    };
  }, [load]);

  const initSeed = async () => {
    setSeedLoading(true);
    try {
      const r = await fetch("/api/playfab/seed-initial", {
        method: "POST",
        cache: "no-store",
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Seed échec");
      await load(); // rafraîchir après seed
    } catch (e: any) {
      setErr(e?.message || "Seed échec");
    } finally {
      setSeedLoading(false);
    }
  };

  const refresh = async () => {
    await load();
  };

  // Décision : afficher solde EU prioritairement depuis l’overview,
  // sinon fallback sur la balance brute PlayFab.
  const euFromOverview =
    typeof overview?.balance === "number" ? overview.balance : null;
  const euFromRaw =
    balanceRaw?.balances && typeof balanceRaw.balances["EU"] === "number"
      ? balanceRaw.balances["EU"]
      : null;

  const effectiveEU = euFromOverview ?? euFromRaw;

  const fmt = (n: number | null | undefined) =>
    typeof n === "number" ? n.toLocaleString("fr-FR") : "—";

  const sat = (n: number | null | undefined) =>
    typeof n === "number" ? `${n}%` : "—";

  const availableCurrencies = balanceRaw
    ? Object.keys(balanceRaw.balances || {})
    : [];

  const noEUDetected =
    effectiveEU == null && availableCurrencies.length > 0 && !availableCurrencies.includes("EU");

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <DashboardSidebar />
      <section className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar
          companyName={overview?.companyName ?? null}
          balance={effectiveEU ?? null}
        />

        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="mt-1 text-white/70">
                Données lues en direct depuis PlayFab.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={refresh}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
              >
                Rafraîchir
              </button>
              <button
                onClick={initSeed}
                disabled={seedLoading}
                className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm hover:bg-emerald-500/20 disabled:opacity-50"
              >
                {seedLoading ? "Initialisation…" : "Initialiser 100 000 €"}
              </button>
            </div>
          </div>

          {loading && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
              Chargement…
            </div>
          )}

          {err && (
            <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {err}
            </div>
          )}

          {/* Alerte informative si la monnaie EU n’existe pas côté PlayFab */}
          {noEUDetected && (
            <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              Aucune monnaie <span className="font-semibold">EU</span> détectée sur ton compte
              PlayFab. Monnaies détectées :{" "}
              <span className="font-mono">
                {availableCurrencies.join(", ") || "—"}
              </span>
              .<br />
              ↳ Crée la devise “EU” dans PlayFab (2 lettres majuscules) ou adapte le code
              côté API/Topbar pour la devise que tu utilises.
            </div>
          )}

          {/* KPIs */}
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <KpiCard title="Solde (€)" value={fmt(effectiveEU)} />
            <KpiCard
              title="Flotte"
              value={
                typeof overview?.fleetCount === "number" ? overview.fleetCount : "—"
              }
            />
            <KpiCard
              title="Entrepôts actifs"
              value={
                typeof overview?.warehousesActive === "number"
                  ? overview.warehousesActive
                  : "—"
              }
            />
            <KpiCard
              title="Contrats en cours"
              value={
                typeof overview?.activeContracts === "number"
                  ? overview.activeContracts
                  : "—"
              }
            />
            <KpiCard
              title="Satisfaction clients"
              value={sat(overview?.customerSatisfaction)}
            />
          </div>

          {/* Debug minimal (aide épistémique, pas de données fictives) */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Activité récente</h2>
              <p className="mt-3 text-sm text-white/60">Aucune donnée disponible.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Diagnostique rapide</h2>
              <ul className="mt-3 text-sm text-white/70 space-y-1">
                <li>
                  Monnaies PlayFab détectées :{" "}
                  <span className="font-mono">
                    {availableCurrencies.join(", ") || "—"}
                  </span>
                </li>
                <li>Solde EU (raw) : {fmt(euFromRaw)}</li>
                <li>Solde EU (overview) : {fmt(euFromOverview)}</li>
              </ul>
              <p className="mt-3 text-xs text-white/50">
                Si ton compte joueur a été créé avant la règle de dépôt initial, utilise
                “Initialiser 100 000 €” ci-dessus (nécessite la route serveur
                <code className="ml-1">/api/playfab/seed-initial</code>).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
