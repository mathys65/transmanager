// Helper PlayFab côté serveur (Node.js)
let cached: any | null = null;

export function getPlayFabServer() {
  if (cached) return cached;

  // require => pas de conflit ESM/CJS avec Turbopack
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
