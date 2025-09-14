// Helper PlayFab côté serveur (Node.js)
let cached: any | null = null;

export function getPlayFabServer() {
  if (cached) return cached;

  // On utilise require pour éviter les soucis d'interop ESM/CJS avec Turbopack
  // et pour garantir que ça ne s'exécute qu'en environnement Node.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const PlayFab = require("playfab-sdk/Scripts/PlayFab/PlayFab");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const PlayFabServer = require("playfab-sdk/Scripts/PlayFab/PlayFabServer");

  const titleId = process.env.PLAYFAB_TITLE_ID;
  const secret  = process.env.PLAYFAB_DEV_SECRET_KEY;
  if (!titleId || !secret) {
    throw new Error("PLAYFAB_TITLE_ID ou PLAYFAB_DEV_SECRET_KEY manquant(s)");
  }

  PlayFab.settings.titleId = titleId;
  PlayFab.settings.developerSecretKey = secret;

  cached = PlayFabServer;
  return cached;
}
