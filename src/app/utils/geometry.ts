import { Rect } from '@models/rect';

export const Intersects = (r1: Rect, r2: Rect): string | null => {
  const dx = (r1.x + r1.width / 2) - (r2.x + r2.width / 2);
  const dy = (r1.y + r1.height /2) - (r2.y + r2.height / 2);
  const width = (r1.width + r2.width) / 2;
  const height = (r1.height + r2.height) / 2;
  const crossWidth = width * dy;
  const crossHeight = height * dx;
  let side = null;

  if (Math.abs(dx) <= width && Math.abs(dy) <= height){
      if (crossWidth > crossHeight) {
          side = (crossWidth>(-crossHeight)) ? 'top' : 'right';
      } else {
          side = (crossWidth>-(crossHeight)) ? 'left': 'bottom';
      }
  }
  return side;
}
