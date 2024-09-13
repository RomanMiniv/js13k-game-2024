import { getTextHitArea } from "../utils";
import { GameObject, IHitArea } from "./GameObject";

export class TextObject extends GameObject {
  content: string;

  constructor(ctx: CanvasRenderingContext2D, x, y, width, height, content: string) {
    super(ctx, x, y, width, height);
    this.content = content;
  }

  // drawHitArea(): void {
  //   const { left, top, width, height } = getTextHitArea(this.ctx, this.content, this.x, this.y, this.width);
  //   this.ctx.strokeRect(left, top, width, height);

  //   // const a = getTextHitArea(this.ctx, this.content, this.x, this.y, this.width);
  //   // this.ctx.fillStyle = "blue";
  //   // this.ctx.font = `bold 12px Courier New`;
  //   // this.ctx.fillText(JSON.stringify(a), this.x, this.y);
  // }

  setFontStyle(): void {
    this.ctx.font = `bold ${this.width}px Courier New`;
  }

  getHitArea(): IHitArea {
    // this.ctx.save();
    this.setFontStyle();
    const hitArea = getTextHitArea(this.ctx, this.content, this.x, this.y, this.width);
    // this.ctx.restore();
    return hitArea;
  }
}
