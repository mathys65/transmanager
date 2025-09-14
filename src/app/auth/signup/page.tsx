"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const companyName = String(form.get("companyName") || "");
    const acceptTerms = form.get("acceptTerms") === "on";

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, companyName, acceptTerms }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      return setErr(json?.error || "Échec de l’inscription.");
    }

    // ✅ Redirection directe vers le Dashboard
    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-md px-4 py-14">
        <h1 className="text-3xl font-bold">Créer un compte</h1>
        <p className="mt-2 text-white/70">Rejoins TransManager et lance ton entreprise.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {/* Champ Nom entreprise */}
          <div>
            <label className="mb-1 block text-sm text-white/80">Nom de l’entreprise</label>
            <input
              name="companyName"
              placeholder="Ex. TransExpress"
              maxLength={25}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>

          {/* Email */}
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

          {/* Mot de passe */}
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

          {/* Case acceptation */}
          <label className="flex items-start gap-3 text-sm text-white/80">
            <input
              type="checkbox"
              name="acceptTerms"
              required
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-500"
            />
            <span>
              J’ai lu et j’accepte les{" "}
              <Link href="/legal/terms" className="text-cyan-300 underline-offset-4 hover:underline" target="_blank">
                règles d’utilisation
              </Link>.
            </span>
          </label>

          {err && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {err}
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
