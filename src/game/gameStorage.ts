export enum EStrorageNames {
  PROGRESS = "progress",
  LORE = "lore"
}

export class GameStorage {
  static NAMASPACE: string = "howItStarted_";

  static SET_DATA(key: string, value: string): void {
    window.localStorage.setItem(GameStorage.NAMASPACE + key, value);
  }
  static GET_DATA(key: string): string {
    return window.localStorage.getItem(GameStorage.NAMASPACE + key);
  }
}
