// src/lib/playfab/getPlayFabClient.ts
// Utilise le module racine pour éviter les chemins internes instables.
const PlayFab: any = require("playfab-sdk");

export function getPlayFabClient() {
  if (!process.env.PLAYFAB_TITLE_ID) {
    throw new Error("PLAYFAB_TITLE_ID manquant dans l'env");
  }
  PlayFab.settings.titleId = process.env.PLAYFAB_TITLE_ID;
  // Retourne l'API client (LoginWithEmailAddress, etc.)
  return PlayFab.PlayFabClient;
}
