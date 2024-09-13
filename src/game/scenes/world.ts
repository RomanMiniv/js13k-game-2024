import { Enemy } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { EScene } from "../game";
import { EStrorageNames, GameStorage } from "../gameStorage";
import { PrisonerObject } from "../objects/PrisonerObject";
import { ProgressBarObject } from "../objects/ProgressBar";
import { getTextHitArea, setTimer } from "../utils";
import { IPopupData, Popup } from "./popup";
import { Scene } from "./scene";

export class World extends Scene {
  fontSize: number = 100;

  gameObjects = [];

  player: Player;
  enemy: Enemy;

  prisionerObjects: PrisonerObject[] = [];
  progressBarObjects: ProgressBarObject[] = [];

  isBossLevel: boolean;

  init(): void {
    super.init();

    const gameProgress = +GameStorage.GET_DATA(EStrorageNames.PROGRESS);
    if (gameProgress) {
      this.prisionersStatus.current = gameProgress + 1;
      if (gameProgress >= this.prisionersStatus.max) {
        this.isBossLevel = true;
      }
    }

    this.player = new Player(this.ctx, this.canvas.width / 2, this.canvas.height / 2, this.fontSize, this.fontSize, "0");
    this.player.init(this.isBossLevel);

    this.enemy = new Enemy(this.ctx, this.player.x * 2, this.player.y * 2, this.fontSize, this.fontSize, "13");
    this.enemy.init(this.isBossLevel);

    if (this.isBossLevel) {
      this.progressBarObjects.push(
        new ProgressBarObject(this.ctx, 20, 50, 250, 20, "#008080"),
        new ProgressBarObject(this.ctx, this.canvas.width - 274, 50, 250, 20, "#008080")
      );
    } else {
      this.showPrisoner();
    }
  }

  prisionersStatus = {
    current: 1,
    max: 12
  };

  showPrisoner(): void {
    setTimeout(() => {
      const prisioner = new PrisonerObject(this.ctx, undefined, undefined, this.fontSize / 2, this.fontSize / 2, String(this.prisionersStatus.current));

      prisioner.init(() => {
        if (this.prisionersStatus.current + 1 > this.prisionersStatus.max) {
          this.isStopRender = true;
          this.player.isStopRender = true;
          this.enemy.isStopRender = true;
        }
        GameStorage.SET_DATA(EStrorageNames.PROGRESS, String(this.prisionersStatus.current));

        setTimeout(() => {
          this.prisionerObjects = [];
          this.prisionersStatus.current++;
          if (this.prisionersStatus.current <= this.prisionersStatus.max) {
            setTimeout(() => {
              this.showPrisoner();
            }, 2000);
          } else {
            this.finishCallback();
          }
        }, 3000);
      });

      this.prisionerObjects.push(prisioner);
    }, 0);
  }

  isStopRender: boolean = false;
  popup: Popup;
  async setResult(isWin: boolean = false): Promise<void> {
    this.isStopRender = true;
    this.player.isStopRender = true;
    this.player.isDead = !isWin;
    this.enemy.isDead = isWin;
    this.enemy.isStopRender = true;

    await setTimer(2000);

    if (isWin) {
      this.battleFinishAnimation();
      GameStorage.SET_DATA(EStrorageNames.PROGRESS, "13");
      this.finishCallback(EScene.OUTRO);
    } else {
      const popupData: IPopupData = {
        title: [
          "Everything was a little different,",
          "let me show you how it really was"
        ],
        items: [
          "Repeat",
          "Back to menu",
        ],
        interactive: [
          true,
          true,
        ],
        callbacks: [
          () => {
            this.finishCallback(EScene.WORLD);
          },
          () => {
            this.finishCallback(EScene.MENU);
          },
        ],
      };
      this.popup = new Popup(this.ctx.canvas, this.ctx, () => { }, popupData);
      this.popup.staticUpdate();
      this.popup.init();
    }
  }


  // scaleStep: number = 1;
  battleFinishAnimation() {
    // this.gameObjects.push(() => {
    //   this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    //   // this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    //   this.ctx.scale(this.scaleStep, this.scaleStep);
    //   this.scaleStep-=.001;
    //   if (this.scaleStep <= .5) {
    //     this.gameObjects = [];
    //   }
    // });
  }

  update(tFrame: number): void {
    super.update(tFrame);

    this.draw();

    this.prisionerObjects.forEach(item => item.render());
    this.progressBarObjects.forEach((item, index) => {
      if (index) {
        item.x = this.canvas.width - 274;
      }
      item.render();
    });

    this.player.render();
    this.enemy.render();

    this.popup?.update(tFrame);

    if (!this.isStopRender) {
      this.detectCollisions();
    }

    this.gameObjects.forEach(gameObject => gameObject());
  }

  draw(): void {
    if (this.isBossLevel) {
      this.progressBarObjects.forEach((item, index) => {
        this.drawBossStatus(index);
      });
    } else {
      this.drawStatus();
    }
  }

  drawStatus(): void {
    this.ctx.save();
    const size = 24;
    this.ctx.font = `bold ${size}px Courier New`;
    this.ctx.fillStyle = "#008080";
    const { current, max } = this.prisionersStatus;
    const text = `Rescued: ${current - 1}/${max}`;
    const { left, width, height } = getTextHitArea(this.ctx, text, 0, 0, size);
    this.ctx.fillText(text, left + width + size, height + size);
    this.ctx.restore();
  }

  drawBossStatus(index: number): void {
    this.ctx.save();

    const size = 24;
    this.ctx.font = `bold ${size}px Courier New`;
    this.ctx.fillStyle = "#008080";

    let text;
    if (index) {
      text = `Thirteen: ${this.progressBarObjects[index].progress}/${100}`;
    } else {
      text = `Zero:\t\t\t\t\t${this.progressBarObjects[index].progress}/${100}`;
    }
    const { left, width, height } = getTextHitArea(this.ctx, text, 0, 0, size);
    let x: number = left + width + size;
    if (index) {
      x = this.canvas.width - 150;
    }
    this.ctx.fillText(text, x, height + size);

    this.ctx.restore();
  }

  detectCollisions(): void {
    // this.ctx.strokeStyle = "black";
    if (this.player.isCollisionWithObject(this.enemy)) {
      // this.ctx.strokeStyle = "red";
      if (!this.isBossLevel) {
        this.setResult(false);
      }
    }

    for (let i = 0; i < this.player.bulletObjects.length; i++) {
      if (this.player.isCollisionWithObject(this.enemy, this.player.bulletObjects[i])) {
        if (!this.player.bulletObjects[i].isDamage) {
          this.player.bulletObjects[i].isDamage = true;
          this.player.destroyBulletObject(this.player.bulletObjects[i].id);

          let progressDelta: number;
          if (this.progressBarObjects[1].progress <= 50) {
            this.enemy.setBerserkMode();
            progressDelta = 1;
          } else {
            progressDelta = 5;
          }
          this.progressBarObjects[1].doProgress(progressDelta);

          if (this.progressBarObjects[1].progress <= 0) {
            this.setResult(true);
          }
        }
      }
    }

    for (let i = 0; i < this.enemy.bombs.length; i++) {
      if (this.player.isCollisionWithObject(this.enemy.bombs[i])) {
        // this.ctx.strokeStyle = "red";
        if (!this.enemy.bombs[i].isDamage) {
          this.enemy.bombs[i].isDamage = true;
          this.progressBarObjects[0].doProgress(25);
          if (this.progressBarObjects[0].progress <= 0) {
            this.setResult(false);
          }
        }
      }
    }

    for (let i = 0; i < this.prisionerObjects.length; i++) {
      if (this.player.isCollisionWithObject(this.prisionerObjects[i])) {
        this.prisionerObjects[i].showInteractHint();

        if (this.player.isInteraction()) {
          this.prisionerObjects[i].doProgress();
        }
        break;
      }
    }
  }
}
