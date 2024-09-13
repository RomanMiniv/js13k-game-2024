import { IPosition } from "../objects/GameObject";
import { calculateHypotenuse, getRandomIntInclusive, setTimer } from "../utils";
import { TextObject } from "../objects/TextObject";
import { BombObject } from "../objects/BombObject";

export class Enemy extends TextObject {
  velocity: number = 16;

  moveTo: IPosition;

  bombs: BombObject[] = [];

  isBossMode: boolean;
  setBerserkMode(): void {
    this.velocity = getRandomIntInclusive(10, 15);
    this.bombCount = getRandomIntInclusive(4, 8);
    this.bombRadius = 400;
  };

  isStopRender: boolean;

  init(isBossMode: boolean): void {
    this.isBossMode = isBossMode;
    this.setMoveTo();
  }

  render(tFrame?: number): void {
    if (!this.isStopRender) {
      this.move();
    }

    this.draw();

    // this.drawHitArea();

    this.bombs.forEach(bomb => bomb.render());
  }

  draw(): void {
    this.ctx.fillStyle = "#CA2C92";
    this.setFontStyle();
    this.ctx.fillText(this.content, this.x, this.y);
  }

  isMoveStop: boolean = true;

  move(): void {
    if (this.isMoveStop) {
      return;
    }

    if (this.x === this.moveTo.x && this.y === this.moveTo.y) {
      this.isMoveStop = true;
      setTimeout(() => {
        this.setMoveTo();
        this.isDropBombs = false;
      }, 500);

      return;
    }

    const distanceX = Math.abs(this.x - this.moveTo.x);
    const distanceY = Math.abs(this.y - this.moveTo.y);

    // const deltaX = distanceX < this.velocity ? distanceX : this.velocity;
    // const deltaY = distanceY < this.velocity ? distanceY : this.velocity;

    let deltaX: number;
    let deltaY: number;

    if (distanceX < this.velocity) {
      deltaX = distanceX;
    } else {
      const startDistanceX = Math.abs(this.startMovePos.x - this.moveTo.x);
      if (distanceX > startDistanceX / 3 && distanceX < startDistanceX * 2 / 3) {
        deltaX = this.velocity / 5;
        this.dropBombs();
      } else {
        deltaX = this.velocity;
      }
    }
    if (distanceY < this.velocity) {
      deltaY = distanceY;
    } else {
      const startDistanceY = Math.abs(this.startMovePos.y - this.moveTo.y);
      if (distanceY > startDistanceY / 3 && distanceY < startDistanceY * 2 / 3) {
        deltaY = this.velocity / 5;
        this.dropBombs();
      } else {
        deltaY = this.velocity;
      }
    }

    const step = calculateHypotenuse({ x: this.x, y: this.y }, this.moveTo);

    this.x += step.x * deltaX;
    this.y += step.y * deltaY;
  }

  startMovePos: IPosition;
  setMoveTo(): void {
    const { width, height } = this.getHitArea();

    this.startMovePos = {
      x: this.x,
      y: this.y
    };

    this.moveTo = {
      x: getRandomIntInclusive(width / 2, this.ctx.canvas.width - width / 2),
      y: getRandomIntInclusive(height / 2 + height / 12, this.ctx.canvas.height - height / 2 + height / 12),
    }

    this.isMoveStop = false;
  }

  bombCount: number = 2;
  bombRadius: number = 150;
  isDropBombs: boolean = false;
  async dropBombs(): Promise<void> {
    if (!this.isBossMode) {
      return;
    }

    if (this.isDropBombs) {
      return;
    }
    this.isDropBombs = true;

    const promises: Promise<void>[] = [];
    for (let i = 0; i < this.bombCount; i++) {
      await setTimer(i * 100);
      promises.push(new Promise((resolve) => {
        const bomb = new BombObject(this.ctx, this.x, this.y, 0, 0);
        this.bombs.push(bomb);
        bomb.init({ x: getRandomIntInclusive(this.x - this.bombRadius, this.x + this.bombRadius), y: getRandomIntInclusive(this.y - this.bombRadius, this.y + this.bombRadius) }, () => {
          resolve();
        });
      }));
    }
    await Promise.all(promises);
    this.bombs = this.bombs.filter(bomb => !bomb.isSkipRender);
    // console.error("bombs", this.bombs.length);
  }
}
