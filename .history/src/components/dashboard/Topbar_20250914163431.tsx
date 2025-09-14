"use client";

import Link from "next/link";

export default function DashboardTopbar() {
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur">
      <div className="text-sm text-white/70">Bienvenue 👋</div>
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80">
          Solde: <span className="font-semibold text-white">€ 125 000</span>
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
