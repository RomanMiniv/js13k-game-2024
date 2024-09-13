import { PrisonerObject } from "../../objects/PrisonerObject";
import { calculateHypotenuse, getRandomDirection, getRandomIntInclusive, getTextHitArea, isMoveEnd, setTimer } from "../../utils";
import { Lore } from "./lore";
import { GameStorage, EStrorageNames } from "../../gameStorage";

export class Culmination extends Lore {
  prisioner: PrisonerObject;
  fontSize: number = 100;

  steps = [
    async () => {
      this.gameObjects.push(() => this.setStoryText(""));

      this.prisioner = new PrisonerObject(this.ctx, undefined, undefined, this.fontSize / 2, this.fontSize / 2, "12");
      this.prisioner.texts[11] = "I believed in you";

      this.gameObjects.push(() => {
        this.prisioner.init(() => { }, { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 3 });
        this.prisioner.render();
      });

      this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

      this.waitSkip(500);
    },
    async () => {
      this.gameObjects.push(() => {
        this.ctx.fillStyle = "#36454F";
        this.ctx.font = "bold 100px Courier New";
        const { top, height } = getTextHitArea(this.ctx, "0", this.prisioner.x, this.prisioner.y, 100);
        this.ctx.fillText("0", this.prisioner.x, this.prisioner.y + height * 1.5);

        this.prisioner.doProgress();
      });
      this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

      await setTimer(3000);
      this.gameObjects.push(() => this.setStoryText("0 saved all the members of the round table and now can face 13"));

      this.waitSkip(1000);
    },
    async () => {
      this.prisioner.texts[11] = "";

      this.gameObjects.push(() => {
        this.setStoryText("however, at the most unexpected moment, 13 appeared");
      });

      this.gameObjects.push(() => {
        const { cX, cY } = this.getCenterPos();

        this.ctx.font = "bold 100px Courier New";
        this.ctx.fillStyle = "#CA2C92";
        this.ctx.fillText("13", cX + this.canvas.width / 4, cY);
      });

      this.waitSkip(1000);
    },
    async () => {
      let isShake: boolean = true;

      this.gameObjects.push(() => {
        this.ctx.font = "bold 100px Courier New";
        this.ctx.fillStyle = "#CA2C92";

        const delta: number = 4;
        const offsetX: number = isShake ? getRandomIntInclusive(-delta, delta) : 0;
        const offsetY: number = isShake ? getRandomIntInclusive(-delta, delta) : 0;

        this.ctx.fillText("13", this.prisioner.x + this.prisioner.getHitArea().width * 1.5 + offsetX, this.prisioner.y + offsetY);
      });
      this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

      await setTimer(1000);
      isShake = false;

      this.prisioner.isDead = true;

      this.gameObjects.push(() => {
        this.setStoryText("and destroyed 12 before their union with the round table");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("end?");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("13 won?");
      });

      this.waitSkip(1000);
    },
    async () => {
      setTimer(500).then(() => {
        this.gameObjects.push(() => {
          this.setStoryText("when it seemed there was no hope, they came");
        });
      });

      const promises: Promise<void>[] = [];
      const numbers: number[] = [56, 72, 84, 49, 26, 15, 31, 64, -5, -21, 35, 44, -89, 156, 99];
      for (let i = 0; i < numbers.length; i++) {
        const offsetX: number = getRandomIntInclusive(100, this.ctx.canvas.width / 2 - 100) * getRandomDirection();
        const offsetY: number = getRandomIntInclusive(100, this.ctx.canvas.height / 2 - 200) * getRandomDirection();

        let stepX: number = 0;
        let stepY: number = 0;
        const velocity: number = getRandomIntInclusive(3, 5);
        let isRender: boolean = true;

        promises.push(new Promise((resolve) => {
          setTimeout(() => {
            this.gameObjects.push(() => {
              if (!isRender) {
                return;
              }
              const { cX, cY } = this.getCenterPos();
              let x: number = cX + offsetX;
              let y: number = cY + offsetY;

              if (this.isMoveTo12) {
                const step = calculateHypotenuse({ x, y }, { x: this.prisioner.x, y: this.prisioner.y });
                stepX += step.x * velocity;
                stepY += step.y * velocity;

                x += stepX;
                y += stepY;

                if (isMoveEnd({ x, y }, { x: this.prisioner.x, y: this.prisioner.y }, velocity)) {
                  isRender = false;
                  x = this.prisioner.x;
                  y = this.prisioner.y;

                  resolve();
                }
              }

              this.ctx.font = "bold 24px Courier New";
              this.ctx.fillStyle = "#36454F";
              this.ctx.fillText(String(numbers[i]), x, y);
            });
            this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);
          }, i * 100);
        }));
      }

      Promise.all(promises).then(() => {
        this.isMoveTo12 = false;
        this.prisioner.isDead = false;
      });

      this.waitSkip(2000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("they did not have the power of the members of the round table");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("and could not replace 12");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("12 was the youngest member of the round table");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("he was cheerful, kind and happy to everyone");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("so when 12 needed help, they didn't care about power 13, they wanted to save 12");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.isMoveTo12 = true;

      setTimer(500).then(() => {
        this.gameObjects.push(() => {
          this.setStoryText("they united with him and gave hope");
        });
      });

      this.waitSkip(3000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("and the round table with all its members united with 0");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("the final battle began");
      });

      this.waitSkip(1000);
    },
  ];

  isMoveTo12: boolean = false;

  setSkipAllText(): void {
    if (+GameStorage.GET_DATA(EStrorageNames.LORE) > 1) {
      super.setSkipAllText();
    }
  }
}
