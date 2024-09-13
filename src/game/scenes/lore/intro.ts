import { prisonBarsPath } from "../../../canvasAssets";
import { getRandomIntInclusive, setTimer } from "../../utils";
import { Lore } from "./lore";
import { EStrorageNames, GameStorage } from "../../gameStorage";

export class Intro extends Lore {
  bgGameObjects = [];

  fly: boolean = false;
  step: number = 0;

  offsetVisibleZone: number = 200;
  isNotVisible(x: number, y: number): boolean {
    return (x <= -this.offsetVisibleZone || x >= this.canvas.width + this.offsetVisibleZone ||
      y <= -this.offsetVisibleZone || y >= this.canvas.height + this.offsetVisibleZone);
  }

  steps = [
    async () => {
      this.gameObjects.push(() => this.setStoryText("From the beginning there was nothing"));

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("and then it took shape");
      });

      this.gameObjects.push(() => {
        const { cX, cY } = this.getCenterPos();
        this.ctx.fillStyle = "#36454F";
        this.ctx.font = "bold 100px Courier New";
        this.ctx.fillText("0", cX, cY);
      });
      this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("everything appeared");
      });

      await setTimer(500);

      this.gameObjects.push(() => {
        const { cX, cY } = this.getCenterPos();
        this.ctx.save();
        this.ctx.translate(cX + 15, cY - 75);
        this.ctx.rotate(-Math.PI / 2);
        const hummer = new Path2D("M0,0 v80 h15 v-80 h-15 m0,0 h-5 v-10 h25 v10 h-5 m5,-5 h10 v5 h10 v-30 h-10 v25 m0,-20 h-45 v-5 h-10 v30 h10 v-25 m0,20 h10");
        this.ctx.lineWidth = 2;
        this.ctx.stroke(hummer);
        this.ctx.restore();
      });

      await setTimer(500);

      await new Promise<void>((resolve) => {
        for (let i = 1; i <= 21; i++) {
          setTimeout(() => {
            this.gameObjects.push(() => {
              const { cX, cY } = this.getCenterPos();

              const fontSize: number = 24;
              this.ctx.font = `bold ${fontSize}px Courier New`;
              this.ctx.fillStyle = "#36454F";
              const measureText = this.ctx.measureText(String(i * 10));

              const offset: number = i >= 10 ? 9 * (~~measureText.width - ~~this.ctx.measureText("10").width) : 0;

              const zeroOffset: number = 15;
              this.ctx.fillText(String(i).replace("21", "..."), (cX + zeroOffset) + i * measureText.width - offset, cY);
              this.ctx.fillText(String(-i).replace("-21", "..."), (cX - zeroOffset) - i * measureText.width + offset, cY);
            });
            if (i === 21) {
              resolve();
            }
          }, 100 * i);
        }
      });

      this.waitSkip(500);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("0 shared his power from 1st to 12th and they formed a round table led by 0");
      });

      let radius = 150;

      await new Promise<void>((resolve) => {
        for (let i = 1, j = 210; i <= 12; i++, j += 30) {
          setTimeout(() => {
            let radians = -j * (Math.PI / 180);
            this.gameObjects.push(() => {
              const { cX, cY } = this.getCenterPos();
              this.ctx.fillStyle = "#36454F";
              this.ctx.font = "bold 50px Courier New";
              const offset = this.fly ? this.step : 0;
              const x = cX + (radius + offset * i) * Math.sin(radians);
              const y = cY + (radius + offset * i) * Math.cos(radians);

              if (this.isNotVisible(x, y)) {
                return;
              }

              this.ctx.fillText(String(i), x, y);
            });
            this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

            if (i === 12) {
              setTimeout(() => {
                this.gameObjects.push(() => {
                  const { cX, cY } = this.getCenterPos();
                  this.ctx.beginPath();
                  this.ctx.arc(cX, cY, radius - this.ctx.measureText("1").width, 0, 2 * Math.PI);
                  this.ctx.lineWidth = 2;
                  this.ctx.stroke();
                });
                this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);
                resolve();
              }, 150);
            }
          }, 150 * i);
        }
      });

      this.waitSkip(500);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("everything was in harmony");
      });

      for (let i = 0; i < this.positiveEmojis.length; i++) {
        const fontSize: number = 16;
        const x = getRandomIntInclusive(fontSize, this.canvas.width - fontSize);
        const y = getRandomIntInclusive(fontSize + 50, this.canvas.height - fontSize - 50);
        this.bgGameObjects.push(() => {
          this.ctx.fillStyle = "#36454F";
          this.ctx.font = `bold ${fontSize}px Courier New`;
          this.ctx.fillText(this.positiveEmojis[i], x, y);
        });
      }

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("until 13 envied the power of twelve");
      });

      let isShake: boolean = true;

      this.gameObjects.push(() => {
        const { cX, cY } = this.getCenterPos();

        this.ctx.font = "bold 50px Courier New";
        this.ctx.fillStyle = "#CA2C92";

        const delta: number = 4;
        const offsetX: number = isShake ? getRandomIntInclusive(-delta, delta) : 0;
        const offsetY: number = isShake ? getRandomIntInclusive(-delta, delta) : 0;

        this.ctx.fillText("13", cX + this.canvas.width / 4 + offsetX, cY + offsetY);
      });
      this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

      this.waitSkip(1000);

      await setTimer(1000);
      isShake = false;
    },
    async () => {
      let radius = 150;

      this.gameObjects.push(() => {
        this.setStoryText("and then tricked and imprisoned the members of the round table");
      });

      await setTimer(500);

      await new Promise<void>((resolve) => {
        for (let i = 1, j = 210; i <= 12; i++, j += 30) {
          setTimeout(() => {
            this.gameObjects.push(() => {
              const { cX, cY } = this.getCenterPos();

              let radians = -j * (Math.PI / 180);

              const offset = this.fly ? (this.step * i) : 0;
              const x = cX + (radius + offset) * Math.sin(radians) - 75 / 2;
              const y = cY + (radius + offset) * Math.cos(radians) - 50 / 2;

              if (this.isNotVisible(x, y)) {
                return;
              }

              const prisonBars = prisonBarsPath(x, y);
              this.ctx.lineWidth = 2;
              this.ctx.stroke(prisonBars);
            });
            this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

            if (i === 12) {
              resolve();
            }
          }, 150 * i);
        }
      });

      this.waitSkip(500);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("and separated them");
      });

      this.fly = true;

      await setTimer(3000);

      this.waitSkip(0);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("0 lost his power and was unable to stop 13");
      });
      
      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("there was only hope for unification with all the members of the round table");
      });

      this.gameObjectIndexesForSave.splice(0, 1);

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("so 0 disappeared in their search");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("and chaos began, led by 13");
      });

      this.bgGameObjects = [];

      for (let i = 0; i < this.negativeEmojis.length; i++) {
        const fontSize: number = 16;
        const x = getRandomIntInclusive(fontSize, this.canvas.width - fontSize);
        const y = getRandomIntInclusive(fontSize + 50, this.canvas.height - fontSize - 50);
        this.bgGameObjects.push(() => {
          this.ctx.fillStyle = "#36454F";
          this.ctx.font = `bold ${fontSize}px Courier New`;
          this.ctx.fillText(this.negativeEmojis[i], x, y);
        });
        this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);
      }

      this.waitSkip(1000);
    },
  ];

  update(tFrame: number): void {
    super.update(tFrame);

    this.bgGameObjects.forEach(gameObject => gameObject());
    this.gameObjects.forEach(gameObject => gameObject());

    if (this.fly && this.step <= 1000) {
      this.step += 3;
    }
  }

  setSkipAllText(): void {
    if (+GameStorage.GET_DATA(EStrorageNames.LORE) > 0) {
      super.setSkipAllText();
    }
  }
}
