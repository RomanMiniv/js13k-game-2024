export abstract class Scene {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  finishCallback: (data?: unknown) => void;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, finishCallback: (data?: unknown) => void) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.finishCallback = finishCallback;
  }

  init(): void {
    this.setEvents();
  }

  setEvents(): void {

  }
  deleteEvents(): void {

  }

  staticUpdate(): void {
    this.setMask();

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.setBG();
  }

  setMask(): void {

  }

  setBG(): void {
    this.ctx.fillStyle = "#FFFFFA";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update(tFrame: number): void {
    this.setBG();
  }
}
