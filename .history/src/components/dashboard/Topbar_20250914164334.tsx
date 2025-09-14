"use client";

export default function DashboardTopbar({
  companyName,
  balance,
}: {
  companyName?: string | null;
  balance?: number | null;
}) {
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur">
      <div className="text-sm text-white/70">
        {companyName ? `Bienvenue, ${companyName}` : "Bienvenue"}
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80">
          Solde:{" "}
          <span className="font-semibold text-white">
            {typeof balance === "number" ? `€ ${balance.toLocaleString("fr-FR")}` : "—"}
          </span>
        </div>
        <form action="/api/auth/signout" method="post">
          <button className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10">
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}
