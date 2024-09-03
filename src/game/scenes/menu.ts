import { Scene } from "./scene";

export class Menu extends Scene {
  staticUpdate(): void {
    super.staticUpdate();

    this.ctx.fillStyle = "#000";
    this.ctx.fillText("Hello Menu!", this.canvas.width / 2, this.canvas.height / 2);
  }
}
