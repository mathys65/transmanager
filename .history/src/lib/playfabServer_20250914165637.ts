// src/lib/playfabServer.ts
import PlayFab from "playfab-sdk";

if (!process.env.PLAYFAB_TITLE_ID || !process.env.PLAYFAB_DEV_SECRET) {
  throw new Error("PLAYFAB_TITLE_ID et PLAYFAB_DEV_SECRET sont requis.");
}

PlayFab.settings.titleId = process.env.PLAYFAB_TITLE_ID;
(PlayFab as any).settings.developerSecretKey = process.env.PLAYFAB_DEV_SECRET;

export const PlayFabServer = PlayFab.ServerApi;
export const PlayFabClient = PlayFab.ClientApi;
