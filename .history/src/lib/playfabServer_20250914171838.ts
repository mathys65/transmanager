// src/lib/playfabServer.ts
// Le SDK expose PlayFab.PlayFabClient et PlayFab.PlayFabServer en CommonJS.
const PlayFab = require("playfab-sdk");

let configured = false;
function ensureConfigured() {
  if (configured) return;
  const titleId = process.env.PLAYFAB_TITLE_ID;
  const secret  = process.env.PLAYFAB_DEV_SECRET;
  if (!titleId || !secret) {
    throw new Error("PLAYFAB_TITLE_ID et PLAYFAB_DEV_SECRET manquent (.env.local).");
  }
  PlayFab.settings.titleId = titleId;
  PlayFab.settings.developerSecretKey = secret; // clé serveur
  configured = true;
}

export function getPlayFabClient() {
  ensureConfigured();
  return PlayFab.PlayFabClient;   // <-- bon objet (contient LoginWithEmailAddress, etc.)
}

export function getPlayFabServer() {
  ensureConfigured();
  return PlayFab.PlayFabServer;   // <-- bon objet (contient GetUserInventory, etc.)
}
