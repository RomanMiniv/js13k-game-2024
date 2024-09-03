import { getRandomIntInclusive, setTimer } from "../utils";
import { Scene } from "./scene";

export class Intro extends Scene {
  gameObjects = [];
  gameObjectIndexesForSave = [];
  bgGameObjects = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, finishCallback: () => void) {
    super(canvas, ctx, finishCallback);
    this.init();
  }

  init(): void {
    this.steps[this.currentStep]();
  }

  setEvents(): void {
    this.keydownHandler = this.keydownHandler.bind(this)
    document.addEventListener("keydown", this.keydownHandler);
  }

  deleteEvents(): void {
    document.removeEventListener("keydown", this.keydownHandler);
  }

  keydownHandler(e: KeyboardEvent): void {
    if (e.code === "Enter" || e.code === "Space") {
      if (!this.isSkip) {
        return;
      }
      this.isSkip = false;

      if (this.isLastStep()) {
        this.deleteEvents();
        this.finishCallback();
        return;
      }

      const gameObjects = [];
      this.gameObjectIndexesForSave.forEach(gameObjectIndex => {
        gameObjects.push(this.gameObjects[gameObjectIndex]);
      })
      this.gameObjects = [...gameObjects];

      this.gameObjectIndexesForSave = [];
      for (let i = 0; i < gameObjects.length; i++) {
        this.gameObjectIndexesForSave.push(i);
      }

      this.currentStep++;
      this.steps[this.currentStep]();
    }
  }

  isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  setMask(): void {
    this.ctx.clip(new Path2D(`M0,50 h${this.canvas.width} v${this.canvas.height - 100} h-${this.canvas.width} z`));
  }

  currentStep: number = 0;

  fly: boolean = false;
  step: number = 0;

  async waitSkip(time: number) {
    await setTimer(time);
    this.isSkip = true;
  }

  getCenterPos() {
    return {
      cX: this.canvas.width / 2,
      cY: this.canvas.height / 2.5,
    }
  }

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

      const emojis = ["(* ^ ω ^)", "(*￣▽￣)b", "ヽ(・∀・)ﾉ", "╰(▔∀▔)╯", "(─‿‿─)", "<(￣︶￣)>", "☆*:.｡.o(≧▽≦)o.｡.:*☆", "٩(◕‿◕｡)۶", "(￣ω￣)", "( • ⩊ • )", "(≧◡≦)", "\\(★ω★)/", "°˖✧◝(⁰▿⁰)◜✧˖°", "٩(｡•́‿•̀｡)۶", "⸜( *ˊᵕˋ* )⸝", "(￣▽￣*)ゞ", "(ง ื▿ ื)ว"];
      for (let i = 0; i < emojis.length; i++) {
        const fontSize: number = 16;
        const x = getRandomIntInclusive(fontSize, this.canvas.width - fontSize);
        const y = getRandomIntInclusive(fontSize + 50, this.canvas.height - fontSize - 50);
        this.bgGameObjects.push(() => {
          this.ctx.fillStyle = "#36454F";
          this.ctx.font = `bold ${fontSize}px Courier New`;
          this.ctx.fillText(emojis[i], x, y);
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

    // async () => {
    //   this.setStoryText("13 wanted strength, he found followers");
    //   // * підсвітити ранодомно ще червоним кольором приспішників 13 (мб ще до нього підтянути)
    //   await setTimer(2000);
    // },
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

              const prisonBars = new Path2D(`M${x},${y} h75 m0,50 h-75 m7.5,0 v-50 m15,0 v50 m15,0 v-50 m15,0 v50 m15,0 v-50`);
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
      // * якось відобразити це?
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

      const emojis = ["┌∩┐(◣_◢)┌∩┐", "Σ(▼□▼メ", "٩(╬ʘ益ʘ╬)۶", "(ﾉಥ益ಥ)ﾉ", "(｡•́︿•̀｡)", "(っ˘̩╭╮˘̩)っ", "(︶︹︺)", "←~(Ψ▼ｰ▼)∈", "ヾ(`ヘ´)ﾉﾞ", "(・`ω´・)", "(҂ `з´ )", "↑_(ΦwΦ)Ψ", "୧((#Φ益Φ#))୨", "ψ( ` ∇ ´ )ψ", "(ಥ﹏ಥ)", "＼(º □ º l|l)/", "(っ•﹏•)っ ✴==≡눈٩(`皿´҂)ง"];
      for (let i = 0; i < emojis.length; i++) {
        const fontSize: number = 16;
        const x = getRandomIntInclusive(fontSize, this.canvas.width - fontSize);
        const y = getRandomIntInclusive(fontSize + 50, this.canvas.height - fontSize - 50);
        this.bgGameObjects.push(() => {
          this.ctx.fillStyle = "#36454F";
          this.ctx.font = `bold ${fontSize}px Courier New`;
          this.ctx.fillText(emojis[i], x, y);
        });
        this.gameObjectIndexesForSave.push(this.gameObjects.length - 1);
      }

      this.waitSkip(1000);
    },
  ];

  setBG(): void {
    this.ctx.fillStyle = "#FFFFFA";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setStoryText(text: string): void {
    this.ctx.font = "bold 24px Courier New";
    this.ctx.fillStyle = "#36454F";
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height - this.canvas.height / 4);

    this.setSkipText();
  }

  isSkip: boolean = false;
  setSkipText(): void {
    if (this.isSkip) {
      this.ctx.font = "bold 24px Courier New";
      this.ctx.fillStyle = "#e6b800";
      this.ctx.fillText("[Press Space or Enter to skip]", this.canvas.width / 2, this.canvas.height - this.canvas.height / 4 + 48);
    }
  }

  update(tFrame: number): void {
    this.setBG();

    this.bgGameObjects.forEach(gameObject => gameObject());
    this.gameObjects.forEach(gameObject => gameObject());

    if (this.fly && this.step <= 1000) {
      this.step += 3;
    }
  }
}
