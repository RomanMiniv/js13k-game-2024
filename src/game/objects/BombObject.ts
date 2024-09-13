import { bombPath } from "../../canvasAssets";
import { calculateHypotenuse, getRandomDirection, getRandomIntInclusive, isMoveEnd, setTimer } from "../utils";
import { GameObject, IHitArea, IPosition } from "./GameObject";

export class BombObject extends GameObject {
  isBombDropped: boolean = false;
  bombVelocity: number = 13;

  gameObjects = [];

  callback;
  isSkipRender: boolean = false;

  isDamage: boolean;

  moveTo: IPosition;
  init(moveTo: IPosition, callback: () => void) {
    this.moveTo = moveTo;
    this.callback = callback;
  }

  isMove: boolean = true;
  async move(): Promise<void> {
    if (!this.isMove) {
      return;
    }

    const step = calculateHypotenuse({ x: this.x, y: this.y }, this.moveTo);
    this.x += step.x * this.bombVelocity;
    this.y += step.y * this.bombVelocity;

    if (isMoveEnd({ x: this.x, y: this.y }, this.moveTo, this.bombVelocity)) {
      this.x = this.moveTo.x;
      this.y = this.moveTo.y;
      this.isMove = false;

      await this.preExplode();
      await this.explode();
      await this.explosionParticles(40);
      setTimeout(() => {
        this.isSkipRender = true;
        this.callback();
      }, 0);
    }
  }

  async preExplode() {
    this.gameObjects.push(() => {
      const delta: number = 2;

      const offsets = [];
      for (let i = 0; i < 2; i++) {
        offsets.push(getRandomIntInclusive(-delta, delta));
      }

      this.x += offsets[0];
      this.y += offsets[1];
    });

    await setTimer(getRandomIntInclusive(750, 2200));
    this.gameObjects.pop();
  }

  explodeVelocity: number = 50;
  explodeRadius: number = 0;
  maxR: number = 130;
  async explode(): Promise<void> {
    return new Promise((resolve) => {
      this.gameObjects.push(() => {
        this.explodeRadius += this.explodeVelocity;
        if (Math.abs(this.maxR - this.explodeRadius) <= this.explodeVelocity) {
          this.explodeRadius = this.maxR;
          resolve();
        }
        this.ctx.save();
        this.ctx.fillStyle = "#36454F";
        this.ctx.strokeStyle = "#36454F";
        this.ctx.globalAlpha = .05;
        this.ctx.fillRect(this.x - this.explodeRadius, this.y - this.explodeRadius, this.explodeRadius * 2, this.explodeRadius * 2);
        this.ctx.globalAlpha = 1;
        this.ctx.strokeRect(this.x - this.explodeRadius, this.y - this.explodeRadius, this.explodeRadius * 2, this.explodeRadius * 2);
        this.ctx.restore();
      });
    });
  }

  explosionParticles(count: number) {
    const promises: Promise<void>[] = [];

    for (let i = 0; i < count; i++) {
      promises.push(new Promise((resolve) => {
        let x = this.x;
        let y = this.y;
        const width: number = getRandomIntInclusive(5, 15);
        const height: number = getRandomIntInclusive(5, 15);

        let isMove: boolean = true;

        const velocity: number = getRandomIntInclusive(15, 25);
        const moveTo: IPosition = {
          x: x + getRandomIntInclusive(0, this.explodeRadius) * getRandomDirection(),
          y: y + getRandomIntInclusive(0, this.explodeRadius) * getRandomDirection()
        };

        const alpha = getRandomIntInclusive(1, 9) / 10;

        this.gameObjects.push(() => {
          this.ctx.save();
          this.ctx.fillStyle = "#36454F";
          this.ctx.globalAlpha = alpha;
          this.ctx.fillRect(x - width / 2, y - height / 2, width, height);
          this.ctx.globalAlpha = 1;
          this.ctx.restore();

          if (!isMove) {
            return;
          }

          const step = calculateHypotenuse({ x, y }, moveTo);
          x += step.x * velocity;
          y += step.y * velocity;

          if (isMoveEnd({ x, y }, moveTo, velocity)) {
            x = moveTo.x;
            y = moveTo.y;
            isMove = false;
            resolve();
          }
        });
      }));
    }

    promises.push(new Promise(resolve => {
      this.gameObjects.push(() => {
        this.shakeWorld();
      });
      setTimer(250).then(() => {
        this.clearShakeWorld();
        resolve();
      });
    }));

    return Promise.all(promises);
  }

  draw(): void {
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#36454F";
    const bomb = bombPath(this.x, this.y);
    this.ctx.stroke(bomb);

    // const a = this.getExplosionHitArea();
    // this.ctx.fillStyle = "blue";
    // this.ctx.font = `bold 12px Courier New`;
    // this.ctx.fillText(JSON.stringify(a), this.x, this.y);
  }

  getHitArea(): IHitArea {
    const hitArea: IHitArea = {
      left: this.x - this.explodeRadius,
      top: this.y - this.explodeRadius,
      width: this.explodeRadius * 2,
      height: this.explodeRadius * 2
    };
    if (this.isSkipRender) {
      hitArea.width = 0;
    }
    return hitArea;
  }

  render(): void {
    if (this.isSkipRender) {
      return;
    }

    // this.ctx.save();
    this.gameObjects.forEach(gameObject => gameObject());

    this.draw();
    this.move();


    // this.ctx.restore();
  }

  isSkake: boolean = true;
  shakeWorld() {
    if (!this.isSkake) {
      return;
    }
    const delta: number = 8;
    const x: number = getRandomIntInclusive(-delta, delta);
    const y: number = getRandomIntInclusive(-delta, delta);
    this.ctx.translate(x, y);
  }
  clearShakeWorld(): void {
    this.isSkake = false;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
