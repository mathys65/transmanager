import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* arrière-plan animé discret */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl"></div>
          <div className="absolute -bottom-32 left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-2xl"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Bâtis ton empire du transport.
              </h1>
              <p className="mt-4 text-white/80">
                Crée ta société, achète des camions, signe des contrats, optimise tes routes et
                surveille ta flotte en <span className="font-semibold text-cyan-300">quasi temps réel</span>.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/auth/signup"
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-900 transition hover:bg-cyan-400"
                >
                  Commencer gratuitement
                </Link>
                <Link
                  href="/auth/signin"
                  className="rounded-xl border border-white/20 px-5 py-3 font-medium text-white/90 transition hover:bg-white/10"
                >
                  Se connecter
                </Link>
                <a
                  href="#features"
                  className="text-sm text-white/70 underline-offset-4 hover:underline"
                >
                  Voir les fonctionnalités
                </a>
              </div>

              {/* points clés */}
              <ul className="mt-8 grid max-w-xl gap-3 text-white/80">
                {[
                  "Carte vivante : véhicules qui bougent (mise à jour ~10 s).",
                  "Économie serveur PlayFab : anti-triche, progression persistante.",
                  "Contrats dynamiques, maintenance, carburant, retards et pénalités.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-[6px] inline-block h-2 w-2 rounded-full bg-cyan-400"></span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* visuel mockup */}
            <div className="relative">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-3 shadow-2xl">
                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl">
                  {/* Mock mini-carte avec routes + camions */}
                  <svg viewBox="0 0 800 500" className="h-full w-full bg-slate-900">
                    {/* routes */}
                    <path d="M20 420 C200 350, 300 350, 780 420" stroke="#64748b" strokeWidth="14" fill="none" strokeLinecap="round"/>
                    <path d="M40 120 C220 180, 420 60, 760 120" stroke="#475569" strokeWidth="10" fill="none" strokeLinecap="round"/>
                    <path d="M120 460 L680 60" stroke="#334155" strokeWidth="8" fill="none" strokeLinecap="round"/>
                    {/* dépôts */}
                    <circle cx="140" cy="420" r="10" fill="#22d3ee"/>
                    <circle cx="660" cy="100" r="10" fill="#22d3ee"/>
                    {/* camions */}
                    <g>
                      <rect x="260" y="330" width="28" height="16" rx="3" fill="#22d3ee"/>
                      <rect x="288" y="334" width="18" height="8" rx="2" fill="#e2e8f0"/>
                    </g>
                    <g>
                      <rect x="520" y="280" width="28" height="16" rx="3" fill="#22d3ee"/>
                      <rect x="548" y="284" width="18" height="8" rx="2" fill="#e2e8f0"/>
                    </g>
                    <g>
                      <rect x="420" y="96" width="28" height="16" rx="3" fill="#22d3ee"/>
                      <rect x="448" y="100" width="18" height="8" rx="2" fill="#e2e8f0"/>
                    </g>
                  </svg>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-white/80">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-white/60">Solde</div>
                    <div className="text-lg font-semibold">€ 125 000</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-white/60">Flotte</div>
                    <div className="text-lg font-semibold">12 camions</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-white/60">Contrats</div>
                    <div className="text-lg font-semibold">7 actifs</div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-cyan-500/10 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Ce que tu peux faire</h2>
          <p className="mt-2 max-w-2xl text-white/70">
            Conçois ton réseau, gère tes équipes et fais croître ton entreprise. Tout est pensé
            pour une progression claire et exigeante.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Feature
              title="Carte vivante"
              desc="Observe tes véhicules se déplacer et atteindre les dépôts, avec mise à jour serveur ~10 s et interpolation fluide côté client."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                  <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" fill="currentColor" />
                </svg>
              }
            />
            <Feature
              title="Économie réaliste"
              desc="Contrats, prix du carburant, maintenance, pénalités de retard : prends les bonnes décisions pour rester rentable."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                  <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" />
                </svg>
              }
            />
            <Feature
              title="Anti-triche serveur"
              desc="Toutes les écritures passent par le serveur (PlayFab). Les clients envoient des intentions, pas des résultats."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                  <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" fill="currentColor" />
                </svg>
              }
            />
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-900 transition hover:bg-cyan-400"
            >
              Créer mon entreprise
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-xl border border-white/20 px-5 py-3 font-medium text-white/90 transition hover:bg-white/10"
            >
              Reprendre ma partie
            </Link>
            <span className="text-sm text-white/60">
              Bientôt : authentification + sauvegarde PlayFab.
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-white/60">
          © {new Date().getFullYear()} TransManager — Prototype web.
        </div>
      </footer>
    </main>
  );
}

function Feature({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/50 hover:bg-white/[0.08]">
      <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-cyan-500/20 p-2 text-cyan-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-white/75">{desc}</p>
    </div>
  );
}
