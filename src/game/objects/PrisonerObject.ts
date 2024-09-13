import { prisonBarsPath } from "../../canvasAssets";
import { getRandomIntInclusive, getTextHitArea, } from "../utils";
import { IHitArea, IPosition } from "./GameObject";
import { TextObject } from "./TextObject";

export class PrisonerObject extends TextObject {
  isBombDropped: boolean = false;
  bombVelocity: number = 13;

  texts: string[] = [
    "A journey starts with one step",
    "Don't forget to be awesome",
    "You've never let me down",
    "You have such a big heart",
    "Don't give up, you can do this",
    "You're making a big change",
    "You're so brave",
    "Small progress is still progress",
    "One step at a time, you're almost there",
    "Good Luck",
    "Your advertisement can be here",
    "",
  ];

  gameObjects = [];

  callback;

  init(callback: () => void, pos?: IPosition) {
    this.callback = callback;

    if (pos) {
      this.x = pos.x;
      this.y = pos.y;
      return;
    }

    const offsetX: number = 300;
    const offsetY: number = 100;
    const x: number = getRandomIntInclusive(offsetX, this.ctx.canvas.width - offsetX);
    const y: number = getRandomIntInclusive(offsetY, this.ctx.canvas.height - offsetY);

    this.x = x;
    this.y = y;
  }

  showInteractHint(): void {
    if (+this.content > 1 || this.isProgressFinished) {
      return;
    }
    const { height } = this.getHitArea();

    const y = this.y - height * 1.4;
    const size = 36;
    const color = "#008080";

    this.ctx.save();
    this.ctx.font = `bold ${size}px Courier New`;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;

    this.ctx.beginPath();
    this.ctx.arc(this.x, y, size / 2, 0, 2 * Math.PI);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.fillText("E", this.x, y);
    this.ctx.restore();
  }

  prisonBarsDelta: number = 0;
  isDead: boolean = false;
  draw(): void {
    this.ctx.save();

    this.ctx.fillStyle = "#36454F";
    this.ctx.font = `bold ${this.width}px Courier New`;
    this.ctx.fillText(String(this.content), this.x, this.y);

    const { left, top } = this.getHitArea();
    let x: number = left;
    if (this.isProgressFinished) {
      x -= this.prisonBarsDelta;
    }

    const prisonBars = prisonBarsPath(x, top);
    this.ctx.lineWidth = 2;
    this.ctx.stroke(prisonBars);

    if (!this.isProgressFinished) {
      this.drawProgressBar();
    }

    if (this.isDead) {
      this.ctx.strokeStyle = "#CA2C92";
      const { left, top, width, height } = getTextHitArea(this.ctx, "12", this.x, this.y, this.width);
      const dead = new Path2D(`M${left},${top} l${width},${height} m0,${-height} l${-width},${height}`);
      this.ctx.lineWidth = 4;
      this.ctx.stroke(dead);
    }


    // this.ctx.strokeRect(left, top, width, height);

    this.ctx.restore();

    // const a = this.getExplosionHitArea();
    // this.ctx.fillStyle = "blue";
    // this.ctx.font = `bold 12px Courier New`;
    // this.ctx.fillText(JSON.stringify(a), this.x, this.y);
  }

  openPrisonBars() {
    this.prisonBarsDelta += 2;
    const { width, height } = this.getHitArea();
    if (this.prisonBarsDelta >= width) {
      this.gameObjects = [];
      this.gameObjects.push(() => {
        this.ctx.save();
        this.ctx.font = "bold 24px Courier New";
        this.ctx.fillStyle = "#36454F";
        this.ctx.fillText(this.texts[+this.content - 1], this.x, this.y - height);
        this.ctx.restore();
      });
      this.callback();
    }
  }

  progress: number = 100;
  drawProgressBar(): void {
    const w: number = this.prisonBarsMetrics.width / 2;
    const h: number = 10;
    const x: number = this.x - w / 2;
    const y: number = this.y - this.prisonBarsMetrics.height / 2 - h * 1.5;
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.fillRect(x, y, (this.progress * w) / 100, h);
  }

  isProgressFinished: boolean = false;
  doProgress(): void {
    if (this.isProgressFinished) {
      return;
    }
    this.progress--;
    if (this.progress <= 0) {
      this.isProgressFinished = true;
      this.gameObjects.push(() => {
        this.openPrisonBars();
      });
    }
  }

  prisonBarsMetrics = {
    width: 75,
    height: 50
  };
  getHitArea(): IHitArea {
    const hitArea: IHitArea = {
      left: this.x - this.prisonBarsMetrics.width / 2,
      top: this.y - this.prisonBarsMetrics.height / 2,
      width: this.prisonBarsMetrics.width,
      height: this.prisonBarsMetrics.height
    };
    return hitArea;
  }

  render(): void {
    this.gameObjects.forEach(gameObject => gameObject());

    this.draw();
  }
}
