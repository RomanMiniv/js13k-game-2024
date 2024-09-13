import { GameObject, IHitArea } from "./GameObject";

export class ProgressBarObject extends GameObject {
  color: string;

  constructor(ctx: CanvasRenderingContext2D, x, y, width, height, color: string) {
    super(ctx, x, y, width, height);
    this.color = color;
  }

  getHitArea(): IHitArea {
    throw new Error("Method not implemented.");
  }

  render(): void {
    this.draw();
  }

  progress: number = 100;
  draw(): void {
    this.ctx.save();
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    this.ctx.fillRect(this.x, this.y, (this.progress * this.width) / 100, this.height);
    this.ctx.restore();
  }

  isProgressFinished: boolean = false;
  doProgress(percentage: number): void {
    if (this.isProgressFinished) {
      return;
    }
    this.progress -= percentage;
    if (this.progress <= 0) {
      this.isProgressFinished = true;
    }
  }
}
