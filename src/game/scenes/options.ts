import { Scene } from "./scene";

export class Options extends Scene {
  setEvents(): void {
    this.keydownHandler = this.keydownHandler.bind(this);
    document.addEventListener("keydown", this.keydownHandler);
  }

  deleteEvents(): void {
    document.removeEventListener("keydown", this.keydownHandler);
  }

  keydownHandler(e: KeyboardEvent): void {
    if (e.code === "Enter" || e.code === "Space") {
      this.deleteEvents();
      this.finishCallback();
    }
  }

  size: number = 36;

  title = [
    "Movement - [WASD / Arrow Keys]",
    "Interaction - [E]",
    "Attack - [LMB (left mouse button)]",
    "Skip - [Space / Enter]",
    "Skip all - [ESC]"
  ];

  update(tFrame: number): void {
    super.update(tFrame);

    this.ctx.font = `bold ${this.size}px Courier New`;

    const x: number = this.canvas.width / 2;
    this.ctx.fillStyle = "#008080";
    this.title.forEach((part, index) => {
      this.ctx.fillText(part, x, this.canvas.height / 6 + index * this.size * 2);
    });

    this.ctx.font = "bold 24px Courier New";
    this.ctx.fillStyle = "#e6b800";
    this.ctx.fillText("[Press Space or Enter to skip]", this.canvas.width / 2, this.canvas.height - this.canvas.height / 4 + 48);
  }
}
