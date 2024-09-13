import { GameObject, IHitArea, IPosition } from "../objects/GameObject";
import { getTextHitArea } from "../utils";
import { TextObject } from "../objects/TextObject";
import { BombObject } from "../objects/BombObject";
import BulletObject from "../objects/BulletObject";

export class Player extends TextObject {
  velocity: number = 8;

  isBossMode: boolean;
  init(isBossMode: boolean): void {
    this.isBossMode = isBossMode;
    if (isBossMode) {
      this.isShowInteractHint = true;
    }
    this.setEvents();
  }

  isStopRender: boolean;

  setEvents(): void {
    this.keydownHandler = this.keydownHandler.bind(this);
    this.keyupHandler = this.keyupHandler.bind(this);
    this.mousedownHandler = this.mousedownHandler.bind(this);

    document.addEventListener("keydown", this.keydownHandler);
    document.addEventListener("keyup", this.keyupHandler);
    document.addEventListener("mousedown", this.mousedownHandler);
  }

  deleteEvents(): void {
    document.removeEventListener("keydown", this.keydownHandler);
    document.removeEventListener("keyup", this.keyupHandler);
    document.removeEventListener("mousedown", this.mousedownHandler);
  }

  keysPressed: string[] = [];
  keydownHandler(e: KeyboardEvent): void {
    if (this.isStopRender) {
      return;
    }
    this.keysPressed.push(e.code);
    this.keysPressed = [...new Set(this.keysPressed)];
  }
  keyupHandler(e: KeyboardEvent): void {
    if (this.isStopRender) {
      return;
    }
    this.deletePressedKey(e.code);
  }
  mousedownHandler(e: MouseEvent): void {
    if (this.isStopRender) {
      return;
    }
    if (!e.button && this.isBossMode) {
      this.isShowInteractHint = false;
      const { top, height } = this.getHitArea();
      this.attack({ x: this.x, y: top + height / 2 }, { x: e.clientX, y: e.clientY }, 16);
    }
  }
  deletePressedKey(keyCode: string) {
    const keyIndex: number = this.keysPressed.findIndex((key => key === keyCode));
    if (keyIndex > -1) {
      this.keysPressed.splice(keyIndex, 1);
    }
  }

  bulletObjects: BulletObject[] = [];
  attack(startPosition: IPosition, endPosition: IPosition, velocity: number) {
    const bullet: BulletObject = new BulletObject(
      this.ctx,
      { start: startPosition, end: endPosition },
      this.bulletObjects.length,
      velocity,
      "#36454F"
    );
    this.bulletObjects.push(bullet);
  }

  destroyBulletObject(id: number): void {
    this.bulletObjects.splice(this.bulletObjects.findIndex(bullet => bullet.id === id), 1);
  }

  render(tFrame?: number): void {
    if (!this.isStopRender) {
      this.move();
    }

    this.bulletObjects.forEach(bulletObject => bulletObject.render());

    this.draw();

    // this.drawHitArea();
  }

  isDead: boolean;
  draw(): void {
    this.ctx.fillStyle = "#36454F";
    this.setFontStyle();
    this.ctx.fillText(this.content, this.x, this.y);

    if (this.isDead) {
      this.ctx.save();
      this.ctx.strokeStyle = "#CA2C92";
      const { left, top, width, height } = this.getHitArea();
      const dead = new Path2D(`M${left},${top} l${width},${height} m0,${-height} l${-width},${height}`);
      this.ctx.lineWidth = 4;
      this.ctx.stroke(dead);
      this.ctx.restore();
    }

    this.showInteractHint();
  }

  move(): void {
    let x = 0;
    let y = 0;
    let velocity = 1;

    this.keysPressed.forEach(key => {
      if (key === "ArrowUp" || key === "KeyW") {
        y--;
      }
      if (key === "ArrowRight" || key === "KeyD") {
        x++;
      }
      if (key === "ArrowDown" || key === "KeyS") {
        y++;
      }
      if (key === "ArrowLeft" || key === "KeyA") {
        x--;
      }
    });

    const stepX = x * this.velocity * velocity;
    const stepY = y * this.velocity * velocity;
    const newPos: IPosition = {
      x: this.x + stepX,
      y: this.y + stepY
    };


    if (!this.isWorldCollision({ x: newPos.x, y: this.y })) {
      this.x = newPos.x;
    }
    if (!this.isWorldCollision({ x: this.x, y: newPos.y })) {
      this.y = newPos.y;
    }
  }

  isInteraction(): boolean {
    return this.keysPressed.includes("KeyE");
  }

  isShowInteractHint: boolean;
  showInteractHint(): void {
    if (!this.isShowInteractHint) {
      return;
    }
    const { height } = this.getHitArea();

    const y = this.y - height * 1.4;
    const size = 24;
    const color = "#008080";

    this.ctx.save();
    this.ctx.font = `bold ${size}px Courier New`;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;

    this.ctx.beginPath();
    this.ctx.arc(this.x, y, size, 0, 2 * Math.PI);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.fillText("LMB", this.x, y);
    this.ctx.restore();
  }

  isWorldCollision(pos: IPosition): boolean {
    this.setFontStyle();
    const { left, top, width, height } = getTextHitArea(this.ctx, this.content, pos.x, pos.y, this.width);
    return left < 0 || top < 0 || (left + width) > this.ctx.canvas.width || (top + height) > this.ctx.canvas.height;
  }

  isCollisionWithObject(gameObject: TextObject | BombObject, playerGameObject: GameObject = this): boolean {
    const { left, top, width, height } = playerGameObject.getHitArea();

    let hitArea: IHitArea = gameObject.getHitArea();
    if (gameObject instanceof BombObject) {
      if (!hitArea.width || !hitArea.height) {
        return false;
      }
    }

    return (
      left + width >= hitArea.left &&
      left <= hitArea.left + hitArea.width &&
      top + height >= hitArea.top &&
      top <= hitArea.top + hitArea.height
    );
  }
}
