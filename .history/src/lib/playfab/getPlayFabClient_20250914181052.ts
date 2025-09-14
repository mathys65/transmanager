import * as PlayFab from "playfab-sdk/Scripts/PlayFab/PlayFabClient";
import "playfab-sdk/Scripts/PlayFab/PlayFabClientApi";

export function getPlayFabClient() {
  if (!process.env.PLAYFAB_TITLE_ID) {
    throw new Error("PLAYFAB_TITLE_ID manquant dans l'env");
  }
  PlayFab.settings.titleId = process.env.PLAYFAB_TITLE_ID;
  return PlayFab;
}
