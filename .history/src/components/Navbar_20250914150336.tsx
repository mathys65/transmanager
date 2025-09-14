"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[radial-gradient(1200px_400px_at_10%_-20%,rgba(56,189,248,0.15),transparent),linear-gradient(to_right,rgba(17,24,39,0.85),rgba(17,24,39,0.85))] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block rounded-md bg-cyan-500/20 p-2">
            {/* Logo minimal SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 15l6-6 4 4 8-8" stroke="currentColor" strokeWidth="2" className="text-cyan-400"/>
              <path d="M21 10v8H5" stroke="currentColor" strokeWidth="2" className="text-white/70"/>
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">TransManager</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-cyan-400"
          >
            Créer un compte
          </Link>
        </nav>
      </div>
    </header>
  );
}
