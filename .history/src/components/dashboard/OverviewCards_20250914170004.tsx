// src/components/dashboard/OverviewCards.tsx
"use client";
import { usePlayfabBalance, usePlayfabStats } from "@/hooks/usePlayfabData";

function StatTile({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

export default function OverviewCards() {
  const { data: bal, loading: lb, err: eb } = usePlayfabBalance();
  const { data: st, loading: ls, err: es } = usePlayfabStats();

  if (lb || ls) return <div className="p-4">Chargement…</div>;
  if (eb) return <div className="p-4 text-red-600">Erreur solde : {eb}</div>;
  if (es) return <div className="p-4 text-red-600">Erreur stats : {es}</div>;

  const eu = bal?.balances?.EU ?? 0;
  const stats = st?.stats ?? {};

  // Exemple d’affichage : adaptez aux noms de stats que VOUS poussez dans PlayFab
  // (par ex. RevenueToday, FleetCount, Warehouses, ActiveContracts, etc.)
  const fleet = stats["FleetCount"] ?? 0;
  const warehouses = stats["Warehouses"] ?? 0;
  const revenueToday = stats["RevenueToday"] ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatTile title="Solde (€)" value={eu.toLocaleString("fr-FR")} />
      <StatTile title="Flotte" value={fleet} />
      <StatTile title="Entrepôts" value={warehouses} />
      <StatTile title="CA du jour (€)" value={revenueToday.toLocaleString("fr-FR")} />
    </div>
  );
}
