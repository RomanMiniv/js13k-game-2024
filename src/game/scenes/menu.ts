import { EScene } from "../game";
import { EStrorageNames, GameStorage } from "../gameStorage";
import { IPopupData, Popup } from "./popup";
import { Scene } from "./scene";

export class Menu extends Scene {
  popup: Popup;

  staticUpdate(): void {
    super.staticUpdate();
    this.popup?.staticUpdate();
  }

  init(): void {
    const progress: number = +GameStorage.GET_DATA(EStrorageNames.PROGRESS);
    const percentagePassedGame: number = Math.round((progress / 13) * 100);
    const popupData: IPopupData = {
      items: [
        `Continue (${percentagePassedGame}%)`,
        "Start new game",
        "Options"
      ],
      interactive: [
        !!GameStorage.GET_DATA(EStrorageNames.PROGRESS),
        true,
        true,
      ],
      callbacks: [
        () => {
          this.finishCallback(EScene.WORLD);
        },
        () => {
          GameStorage.SET_DATA(EStrorageNames.PROGRESS, "");
          this.finishCallback();
        },
        () => {
          this.finishCallback(EScene.OPTIONS);
        },
      ],
    };
    this.popup = new Popup(this.ctx.canvas, this.ctx, () => { }, popupData);

    this.staticUpdate();
    this.popup.init();
  }

  update(tFrame: number): void {
    super.update(tFrame);
    this.popup?.update(tFrame);
  }
}
