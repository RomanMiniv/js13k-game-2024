export const prisonBarsPath = (x: number, y: number): Path2D =>
  new Path2D(`M${x},${y} h75 m0,50 h-75 m7.5,0 v-50 m15,0 v50 m15,0 v-50 m15,0 v50 m15,0 v-50`);

export const bombPath = (x: number, y: number): Path2D => {
  const r = 20;
  const r2 = 10;
  const bomb = new Path2D(`M${x},${y - r + 2} m-${r / 2},0 v-10 h${r} v10 m-${r / 2},-10 q0,-15 30,-15 l-5,-5 l5,5 v-5 v5 h5 h-5 l5,5 l-5,-5 v5 v-5 l-5,5`);
  bomb.moveTo(x + r, y);
  bomb.arc(x, y, r, 0, 2 * Math.PI);
  bomb.moveTo(x + r2, y);
  bomb.arc(x, y, r2, 0, Math.PI * 2);
  return bomb;
}
