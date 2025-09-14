"use client";

import { useState } from "react";
import Link from "next/link";

export default function SigninPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) return setErr(json?.error || "Échec de la connexion.");
    // TODO: redirect /game quand prêt
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-md px-4 py-14">
        <h1 className="text-3xl font-bold">Se connecter</h1>
        <p className="mt-2 text-white/70">Heureux de te revoir.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white/80">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Mot de passe</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>

          {err && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {err}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-900 transition hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>

          <p className="text-center text-sm text-white/70">
            Pas encore de compte ?{" "}
            <Link href="/auth/signup" className="text-cyan-300 hover:underline">
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
