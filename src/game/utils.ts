import { IHitArea, IPosition } from "./objects/GameObject";

export async function setTimer(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

export function getRandomDirection(): number {
  return [1, -1][getRandomIntInclusive(0, 1)];
}

export function getTextHitArea(ctx: CanvasRenderingContext2D, content: string, x: number, y: number, size: number): IHitArea {
  const textMetrics = ctx.measureText(content);

  const bottom: number = y - textMetrics.alphabeticBaseline;
  const height: number = textMetrics.ideographicBaseline - size / 12;

  return {
    left: x - textMetrics.width / 2 + size / 12,
    top: bottom + height,
    width: textMetrics.width - size / 6,
    height: -height
  };
}

export function calculateHypotenuse(start: IPosition, end: IPosition): IPosition {
  const direction = {
    x: start.x < end.x ? 1 : -1,
    y: start.y < end.y ? 1 : -1
  };

  const deltaDistance = {
    x: Math.abs(start.x - end.x),
    y: Math.abs(start.y - end.y)
  };

  const step = { x: 1, y: 1 };
  if (deltaDistance.x > deltaDistance.y) {
    step.y = deltaDistance.y / deltaDistance.x;
  } else {
    step.x = deltaDistance.x / deltaDistance.y;
  }

  step.x *= direction.x;
  step.y *= direction.y;

  return step;
}

export function isMoveEnd(startPos: IPosition, moveTo: IPosition, velocity: number): boolean {
  return Math.abs(startPos.x - moveTo.x) <= velocity && Math.abs(startPos.y - moveTo.y) <= velocity;
}
