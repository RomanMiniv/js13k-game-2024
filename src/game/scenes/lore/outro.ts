import { getRandomIntInclusive, setTimer } from "../../utils";
import { Lore } from "./lore";
import { GameStorage, EStrorageNames } from "../../gameStorage";

export class Outro extends Lore {
  steps = [
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("In the confrontation between 0 and 13 - 0 got the victory");
      });

      this.gameObjects.push(() => {
        const { cX, cY } = this.getCenterPos();
        this.ctx.fillStyle = "#36454F";
        this.ctx.font = "bold 100px Courier New";
        this.ctx.fillText("0", cX, cY);
      });
      this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

      this.gameObjects.push(() => {
        const { cX, cY } = this.getCenterPos();

        this.ctx.font = "bold 50px Courier New";
        this.ctx.fillStyle = "#CA2C92";

        this.ctx.fillText("13", cX + this.canvas.width / 4, cY);
      });
      this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("although 13 did a lot of damage");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("0 did not leave him");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("moreover, he invited him to the round table");
      });

      this.waitSkip(1000);

      this.gameObjectIndexesForSave.splice(1, 1);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("now there are 13 of them");
      });

      let radius = 150;

      const degreeStep: number = 360 / 13;
      await new Promise<void>((resolve) => {
        for (let i = 1, j = degreeStep * 7; i <= 13; i++, j += degreeStep) {
          setTimeout(() => {
            let radians = -j * (Math.PI / 180);
            this.gameObjects.push(() => {
              const { cX, cY } = this.getCenterPos();
              this.ctx.fillStyle = "#36454F";
              this.ctx.font = "bold 50px Courier New";
              const x = cX + radius * Math.sin(radians);
              const y = cY + radius * Math.cos(radians);

              this.ctx.fillText(String(i), x, y);
            });
            this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

            if (i === 13) {
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

      this.waitSkip(10000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("everything was in harmony");
      });

      for (let i = 0; i < this.positiveEmojis.length; i++) {
        const fontSize: number = 16;
        const x = getRandomIntInclusive(fontSize, this.canvas.width - fontSize);
        const y = getRandomIntInclusive(fontSize + 50, this.canvas.height - fontSize - 50);
        this.gameObjects.push(() => {
          this.ctx.fillStyle = "#36454F";
          this.ctx.font = `bold ${fontSize}px Courier New`;
          this.ctx.fillText(this.positiveEmojis[i], x, y);
        });
        this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);
      }

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("wait a minute...");
      });

      this.waitSkip(1000);
    },
    async () => {
      this.gameObjects.push(() => {
        this.setStoryText("WTF?");
      });

      let isShake: boolean = true;

      this.gameObjects.push(() => {
        const { cX, cY } = this.getCenterPos();

        this.ctx.font = "bold 50px Courier New";
        this.ctx.fillStyle = "#CA2C92";

        const delta: number = 4;
        const offsetX: number = isShake ? getRandomIntInclusive(-delta, delta) : 0;
        const offsetY: number = isShake ? getRandomIntInclusive(-delta, delta) : 0;

        this.ctx.fillText("14", cX + this.canvas.width / 4 + offsetX, cY + offsetY);
      });
      this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);

      this.waitSkip(1000);

      await setTimer(2000);
      isShake = false;
    },
  ];

  setSkipAllText(): void {
    if (+GameStorage.GET_DATA(EStrorageNames.LORE) > 2) {
      super.setSkipAllText();
    }
  }
}
