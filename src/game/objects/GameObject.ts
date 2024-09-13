export interface IPosition {
  x: number;
  y: number;
}
export interface ISize {
  width: number;
  height: number;
}

export interface IHitArea {
  left: number;
  top: number;
  width: number;
  height: number;
}

export abstract class GameObject {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) { }

  getPositionCenter(): IPosition {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  isCollisionWithObject(gameObject: GameObject): boolean {
    return (
      this.x + this.width >= gameObject.x &&
      this.x <= gameObject.x + gameObject.width &&
      this.y + this.height >= gameObject.y &&
      this.y <= gameObject.y + gameObject.height
    );
  }

  abstract getHitArea(): IHitArea;
}
