"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOk(false);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const username = String(form.get("username") || "");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) return setErr(json?.error || "Échec de l’inscription.");
    setOk(true);
    // TODO: redirect /game quand prêt
    // window.location.href = "/game";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-md px-4 py-14">
        <h1 className="text-3xl font-bold">Créer un compte</h1>
        <p className="mt-2 text-white/70">Rejoins TransManager et lance ton entreprise.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white/80">Nom d’utilisateur (optionnel)</label>
            <input
              name="username"
              placeholder="Ex. MonEntreprise"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="ton@email.fr"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Mot de passe</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>

          {err && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {err}
            </div>
          )}
          {ok && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              Compte créé. Tu peux commencer à jouer.
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-900 transition hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? "Création…" : "Créer mon compte"}
          </button>

          <p className="text-center text-sm text-white/70">
            Déjà un compte ?{" "}
            <Link href="/auth/signin" className="text-cyan-300 hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
