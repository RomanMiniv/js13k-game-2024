import { IHitArea, IPosition } from "../objects/GameObject";
import { getTextHitArea } from "../utils";
import { Scene } from "./scene";

export interface IPopupData {
  title?: string[];
  items: string[];
  interactive: boolean[];
  callbacks: (() => void)[];
};

export class Popup extends Scene {
  data: IPopupData;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, finishCallback: (data?: unknown) => void, data: IPopupData) {
    super(canvas, ctx, finishCallback);
    this.data = data;

    this.colors = new Array(this.data.items.length).fill(this.baseColor);
  }

  hitAreas: IHitArea[] = [];

  baseColor: string = "#36454F";
  hoverColor: string = "#CA2C92";
  colors: string[];

  size: number = 36;

  setEvents(): void {
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    document.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mousedown", this.mouseDownHandler);
  }

  deleteEvents(): void {
    document.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mousedown", this.mouseDownHandler);
  }

  mouseMoveHandler(e: MouseEvent): void {
    if (!e.button) {
      this.canvas.style.cursor = "";
      this.hitAreas.forEach((hitArea, index) => {
        if (!this.data.interactive[index]) {
          return;
        }
        this.colors[index] = this.baseColor;
        if (this.isPointInArea({ x: e.clientX, y: e.clientY }, hitArea)) {
          this.canvas.style.cursor = "pointer";
          this.colors[index] = this.hoverColor;
        }
      });
    }
  }

  mouseDownHandler(e: MouseEvent): void {
    if (!e.button) {
      this.hitAreas.forEach((hitArea, index) => {
        if (!this.data.interactive[index]) {
          return;
        }
        if (this.isPointInArea({ x: e.clientX, y: e.clientY }, hitArea)) {
          this.canvas.style.cursor = "";
          this.deleteEvents();
          this.finishCallback();
          this.data.callbacks[index]();
        }
      });
    }
  }

  isPointInArea(point: IPosition, hitArea: IHitArea): boolean {
    const { left, top, width, height } = hitArea;
    return point.x >= left && point.x <= left + width && point.y >= top && point.y <= top + height;
  }

  update(tFrame: number): void {
    super.update(tFrame);

    this.ctx.font = `bold ${this.size}px Courier New`;

    const x: number = this.canvas.width / 2;

    if (this.data.title) {
      this.ctx.fillStyle = "#008080";
      this.data.title.forEach((part, index) => {
        this.ctx.fillText(part, x, this.canvas.height / 3 + index * 48);
      });
    }

    this.hitAreas = [];
    this.data.items.forEach((item, index) => {
      if (!this.data.interactive[index]) {
        this.ctx.globalAlpha = .5;
      }
      this.ctx.fillStyle = this.colors[index];
      const y: number = this.canvas.height / (this.data.title ? 2 : 3) + index * 72;
      this.ctx.fillText(item, x, y);
      this.ctx.globalAlpha = 1;

      this.hitAreas.push(getTextHitArea(this.ctx, item, x, y, this.size));
      // const { left, top, width, height } = this.hitAreas[index];
      // this.ctx.strokeRect(left, top, width, height);
    });
  }
}
