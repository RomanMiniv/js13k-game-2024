import { Scene } from "./scene";

export class Gratitude extends Scene {
  size: number = 36;

  title = [
    "Thanks for playing the game!",
    "Hope you had fun :).",
    "Good luck!"
  ];

  staticUpdate(): void {
    super.staticUpdate();
  }

  init(): void {
    setTimeout(() => {
      this.finishCallback();
    }, 10000);
  }

  update(tFrame: number): void {
    super.update(tFrame);

    this.ctx.font = `bold ${this.size}px Courier New`;

    const x: number = this.canvas.width / 2;
    this.ctx.fillStyle = "#008080";
    this.title.forEach((part, index) => {
      this.ctx.fillText(part, x, this.canvas.height / 3 + index * this.size * 2);
    });
  }
}
