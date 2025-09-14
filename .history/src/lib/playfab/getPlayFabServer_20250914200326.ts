// Server-only helper: PlayFab Server API
import * as PlayFab from "playfab-sdk/Scripts/PlayFab/PlayFab";
import "playfab-sdk/Scripts/PlayFab/PlayFabServerApi";

export function getPlayFabServer() {
  const titleId = process.env.PLAYFAB_TITLE_ID;
  const secret  = process.env.PLAYFAB_DEV_SECRET_KEY;

  if (!titleId || !secret) {
    throw new Error("PLAYFAB_TITLE_ID ou PLAYFAB_DEV_SECRET_KEY manquant(s)");
  }

  // Important: set settings à chaque appel côté serveur (sans leak côté client)
  PlayFab.settings.titleId = titleId;
  PlayFab.settings.developerSecretKey = secret;

  return PlayFab.Server;
}
