export abstract class Scene {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  finishCallback: () => void;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, finishCallback: () => void) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.finishCallback = finishCallback;

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
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update(tFrame: number): void {

  }
}
