import { Intro } from "./scenes/intro";
import { Menu } from "./scenes/menu";
import { Scene } from "./scenes/scene";
import { World } from "./scenes/world";

export default class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  scenes: Scene[] = [];
  activeSceneIndex: number = -1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { willReadFrequently: false, alpha: false });

    this.nextScene();

    this.resize();
    this.setEvents();

    this.render(0);
  }

  nextScene(): void {
    this.scenes.splice(this.activeSceneIndex, 1);
    this.activeSceneIndex++;
    this.scenes = [];
    this.scenes = [this.sceneFactory()];

    this.resize();
  }

  sceneFactory() {
    switch (this.activeSceneIndex) {
      case 0:
        return new Intro(this.canvas, this.ctx, () => {
          this.nextScene();
        });
      case 1:
        return new World(this.canvas, this.ctx, () => {
          console.error("end world");
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
