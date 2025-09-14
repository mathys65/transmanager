export const metadata = { title: "Règles d’utilisation — TransManager" };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-bold">Règles d’utilisation</h1>
        <p className="mt-2 text-white/70">Version 1.0 — Dernière mise à jour : {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert mt-8 max-w-none">
          <h2>1. Objet</h2>
          <p>
            TransManager est un jeu de gestion. En créant un compte, tu t’engages à respecter ces règles
            d’utilisation et à adopter un comportement respectueux envers les autres joueurs.
          </p>

          <h2>2. Compte</h2>
          <ul>
            <li>Tu es responsable de la confidentialité de tes identifiants.</li>
            <li>Un seul compte par personne. Les comptes automatisés sont interdits.</li>
          </ul>

          <h2>3. Comportement</h2>
          <ul>
            <li>Pas de triche, d’exploitation de bugs, ni d’ingénierie sociale.</li>
            <li>Pas de propos haineux, harcèlement ou contenu illégal.</li>
          </ul>

          <h2>4. Contenu et économie de jeu</h2>
          <ul>
            <li>La progression et les ressources en jeu sont virtuelles.</li>
            <li>Nous pouvons ajuster l’équilibrage, les fonctionnalités ou réinitialiser certains éléments si nécessaire.</li>
          </ul>

          <h2>5. Données</h2>
          <ul>
            <li>Nous stockons les informations nécessaires au fonctionnement du jeu (ex. email, données de sauvegarde).</li>
            <li>Tu peux demander la suppression de ton compte via le support.</li>
          </ul>

          <h2>6. Sanctions</h2>
          <p>
            En cas de non-respect, nous pouvons limiter l’accès au jeu, suspendre ou supprimer un compte.
          </p>

          <h2>7. Modifications</h2>
          <p>
            Ces règles peuvent évoluer. En cas de mise à jour, une nouvelle version sera publiée ici
            et pourra nécessiter une nouvelle acceptation.
          </p>
        </div>
      </div>
    </main>
  );
}
