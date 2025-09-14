const PlayFab = require("playfab-sdk");

export function getPlayFabServer() {
  if (!process.env.PLAYFAB_TITLE_ID || !process.env.PLAYFAB_DEV_SECRET) {
    throw new Error("PLAYFAB_TITLE_ID ou PLAYFAB_DEV_SECRET manquant.");
  }
  PlayFab.settings.titleId = process.env.PLAYFAB_TITLE_ID;
  PlayFab.settings.developerSecretKey = process.env.PLAYFAB_DEV_SECRET;
  return PlayFab.PlayFabServer;
}
