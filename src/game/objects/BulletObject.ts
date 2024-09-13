
import { calculateHypotenuse } from "../utils";
import { IPosition, GameObject, IHitArea } from "./GameObject";

interface IPositionMovement {
  start: IPosition;
  end: IPosition;
}

export default class BulletObject extends GameObject {
  getHitArea(): IHitArea {
    return {
      left: this.x - this.width,
      top: this.y - this.height,
      width: this.width * 2,
      height: this.height * 2
    };
  }
  positionMovement: IPositionMovement;
  step: IPosition;
  velocity: number;
  id: number;
  isDamage: boolean;
  color: string;

  constructor(ctx: CanvasRenderingContext2D, positionMovement: IPositionMovement, id: number, velocity: number, color: string, size: number = 5) {
    const { x, y } = positionMovement.start;
    super(ctx, x, y, size, size);

    this.id = id;
    this.color = color;

    this.positionMovement = this.correctPositionMovement(positionMovement);
    this.x = positionMovement.start.x;
    this.y = positionMovement.start.y;

    this.step = calculateHypotenuse(
      this.positionMovement.start,
      this.positionMovement.end
    );
    this.velocity = velocity;
  }
  private correctPositionMovement({ start, end }: IPositionMovement): IPositionMovement {
    const bulletCenterEnd: IPosition = {
      x: end.x - this.width / 2,
      y: end.y - this.height / 2
    };

    return {
      start,
      end: bulletCenterEnd
    };
  }
  public render() {
    this.draw();
    this.move();
  }
  private draw(): void {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.restore();

    // const {left, top, width, height} = this.getHitArea();
    // this.ctx.strokeRect(left, top, width, height);
  }
  private move(): void {
    this.x += this.step.x * this.velocity;
    this.y += this.step.y * this.velocity;
  }
}
