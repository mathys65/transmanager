import * as PlayFabServer from "playfab-sdk/Scripts/PlayFab/PlayFabServer";
import "playfab-sdk/Scripts/PlayFab/PlayFabServerApi";

export function getPlayFabServer() {
  if (!process.env.PLAYFAB_TITLE_ID || !process.env.PLAYFAB_DEV_SECRET) {
    throw new Error("PLAYFAB_TITLE_ID ou PLAYFAB_DEV_SECRET manquant.");
  }
  PlayFabServer.settings.titleId = process.env.PLAYFAB_TITLE_ID;
  PlayFabServer.settings.developerSecretKey = process.env.PLAYFAB_DEV_SECRET;
  return PlayFabServer;
}
