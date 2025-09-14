import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
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
                Lance ta société, recrute tes chauffeurs, ouvre des entrepôts et orchestre un réseau
                routier et aérien capable de livrer partout, à l’heure, au meilleur coût, le tout dans un environoment concurenciel.
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

              <ul className="mt-8 grid max-w-xl gap-3 text-white/80">
                {[
                  "Crée ta marque, choisis ta ville de départ et tes premiers véhicules.",
                  "Développe un réseau efficace, de l’enlèvement au dernier kilomètre.",
                  "Fais grandir ta réputation en tenant tes promesses de livraison.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-[6px] inline-block h-2 w-2 rounded-full bg-cyan-400"></span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bloc visuel simple (modules clés) */}
            <div className="relative">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-6 shadow-2xl">
                <h3 className="text-xl font-semibold">Modules clés</h3>
                <ul className="mt-4 space-y-2 text-white/80">
                  <li>• Entrepôts & stocks : emplacements, rotation, ruptures</li>
                  <li>• Centres de tri : hubs, vagues, cut-off, cross-docking</li>
                  <li>• Fret aérien : lignes cargo, escales, capacités ULD</li>
                  <li>• Réseau routier : longue distance & dernier kilomètre</li>
                  <li>• Douanes & SLA : incoterms, contrôles, pénalités</li>
                  <li>• Planification : coûts vs vitesse, priorités, scénarios</li>
                </ul>
                <div className="mt-6 text-sm text-white/60">
                  À venir : rail, météo dynamique, bourse de fret.
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
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Fonctionnalités majeures</h2>
          <p className="mt-2 max-w-2xl text-white/70">
            Conçois un réseau performant, arbitre entre rapidité et marge, et fais évoluer ton
            entreprise du local au mondial.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Feature
              title="Entrepôts & stocks"
              desc="Dimensionne tes dépôts, gère les emplacements et évite les ruptures. Chaque m² compte."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                  <path d="M3 10l9-6 9 6v10H3V10z" fill="currentColor" />
                </svg>
              }
            />
            <Feature
              title="Centres de tri"
              desc="Optimise tes hubs : vagues de tri, cut-off, cross-docking, priorités par service."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                  <path d="M4 4h16v6H4zM4 14h7v6H4zM13 14h7v6h-7z" fill="currentColor" />
                </svg>
              }
            />
            <Feature
              title="Fret aérien"
              desc="Ouvre des lignes cargo, réserve des capacités, gère les escales et les palettes ULD."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                  <path d="M2 13l9-2 2-8 3 6 6 3-8 2-2 8-3-6-7-3z" fill="currentColor" />
                </svg>
              }
            />
            <Feature
              title="Réseau routier"
              desc="Planifie les tournées, maîtrise carburant, péages et maintenance. Tiens les délais."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                  <path d="M12 2l4 20H8L12 2zM3 22h18" fill="currentColor" />
                </svg>
              }
            />
            <Feature
              title="Douanes & SLA"
              desc="Choisis tes incoterms, anticipe les contrôles et protège ta réputation avec des SLA solides."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                  <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" fill="currentColor" />
                </svg>
              }
            />
            <Feature
              title="Planification"
              desc="Simule, arbitre, décide : coût vs vitesse, pics d’activité, scénarios de croissance."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                  <path d="M4 5h16v4H4zM4 11h10v4H4zM4 17h7v4H4z" fill="currentColor" />
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
              Débloque le fret aérien en développant ta réputation.
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
