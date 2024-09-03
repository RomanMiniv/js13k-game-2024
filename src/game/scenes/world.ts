import { Scene } from "./scene";

export class World extends Scene {
  staticUpdate(): void {
    super.staticUpdate();

    this.ctx.fillStyle = "#000";
    this.ctx.fillText("Hello World!", this.canvas.width / 2, this.canvas.height / 2);
  }
}
