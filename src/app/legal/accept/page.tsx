"use client";

import { useState } from "react";
import Link from "next/link";

export default function AcceptTermsPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch("/api/legal/accept", { method: "POST" });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) return setErr(json?.error || "Erreur lors de l’acceptation.");
    setOk(true);

    // 🔑 Redirige vers le tableau de bord
    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-md px-4 py-14">
        <h1 className="text-3xl font-bold">Accepter les règles</h1>
        <p className="mt-2 text-white/70">
          Tu dois accepter la dernière version des{" "}
          <Link href="/legal/terms" target="_blank" className="text-cyan-300 hover:underline">
            règles d’utilisation
          </Link>{" "}
          pour continuer à jouer.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="flex items-start gap-3 text-sm text-white/80">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-500"
            />
            <span>J’ai lu et j’accepte les règles d’utilisation.</span>
          </label>

          {err && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {err}
            </div>
          )}
          {ok && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              Conditions acceptées.
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-900 transition hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? "Validation…" : "Accepter et continuer"}
          </button>
        </form>
      </div>
    </main>
  );
}
