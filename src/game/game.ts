import { EStrorageNames, GameStorage } from "./gameStorage";
import { Gratitude } from "./scenes/gratitude";
import { Culmination } from "./scenes/lore/culmination";
import { Intro } from "./scenes/lore/intro";
import { Outro } from "./scenes/lore/outro";
import { Menu } from "./scenes/menu";
import { Options } from "./scenes/options";
import { Scene } from "./scenes/scene";
import { World } from "./scenes/world";

export enum EScene {
  MENU,
  INTRO,
  WORLD,
  CULMINATION,
  OUTRO,
  GRATITUDE,
  OPTIONS
}

export default class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  scenes: Scene[] = [];
  activeSceneIndex: number = -1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { willReadFrequently: false, alpha: false });

    GameStorage.GET_DATA(EStrorageNames.PROGRESS) ?? GameStorage.SET_DATA(EStrorageNames.PROGRESS, "");

    this.nextScene();

    this.resize();
    this.setEvents();

    this.render(0);
  }

  nextScene(sceneIndex?: number): void {
    this.scenes.splice(this.activeSceneIndex, 1);
    this.activeSceneIndex = sceneIndex ?? this.activeSceneIndex + 1;
    this.scenes = [];
    this.scenes = [this.sceneFactory()];

    this.resize();
    this.scenes[0].init();
  }

  sceneFactory() {
    switch (this.activeSceneIndex) {
      case EScene.MENU:
        return new Menu(this.canvas, this.ctx, (sceneIndex: EScene) => {
          this.nextScene(sceneIndex);
        });
      case EScene.INTRO:
        return new Intro(this.canvas, this.ctx, () => {
          GameStorage.GET_DATA(EStrorageNames.LORE) ?? GameStorage.SET_DATA(EStrorageNames.LORE, "1");
          this.nextScene();
        });
      case EScene.WORLD:
        return new World(this.canvas, this.ctx, (sceneIndex: EScene) => {
          this.nextScene(sceneIndex);
        });
      case EScene.CULMINATION:
        return new Culmination(this.canvas, this.ctx, () => {
          if (+GameStorage.GET_DATA(EStrorageNames.LORE) < 2) {
            GameStorage.SET_DATA(EStrorageNames.LORE, "2");
          }
          this.nextScene(EScene.WORLD);
        });
      case EScene.OUTRO:
        return new Outro(this.canvas, this.ctx, () => {
          if (+GameStorage.GET_DATA(EStrorageNames.LORE) < 3) {
            GameStorage.SET_DATA(EStrorageNames.LORE, "3");
          }
          this.nextScene();
        });
      case EScene.GRATITUDE:
        return new Gratitude(this.canvas, this.ctx, () => {
          this.nextScene(EScene.MENU);
        });
      case EScene.OPTIONS:
        return new Options(this.canvas, this.ctx, () => {
          this.nextScene(EScene.MENU);
        });
    }
  }

  setEvents(): void {
    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.scenes.forEach(scene => scene.staticUpdate());
  }

  render(tFrame: number): void {
    requestAnimationFrame(this.render.bind(this));

    this.scenes.forEach(scene => scene.update(tFrame));
  }
}
