// src/lib/playfabServer.ts
import PlayFab from "playfab-sdk";

function ensureConfigured() {
  const titleId = process.env.PLAYFAB_TITLE_ID;
  const secret = process.env.PLAYFAB_DEV_SECRET;
  if (!titleId || !secret) {
    throw new Error(
      "PLAYFAB_TITLE_ID et PLAYFAB_DEV_SECRET manquent. Ajoute-les dans .env.local puis redémarre le serveur."
    );
  }
  PlayFab.settings.titleId = titleId;
  (PlayFab as any).settings.developerSecretKey = secret;
}

export function getPlayFabServer() {
  ensureConfigured();
  return PlayFab.ServerApi;
}

export function getPlayFabClient() {
  ensureConfigured();
  return PlayFab.ClientApi;
}
