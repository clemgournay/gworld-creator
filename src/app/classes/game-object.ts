import { Area } from '@models/area';
import { Collider } from './collider';
import { Rect } from '@models/rect';
import { Tile } from './tile';

export class GameObject {

  id: string;
  name: string;
  tiles: Array<Tile>;
  collider: Collider | null;

  constructor(tiles: Array<Tile>, /*i: number, j: number, width: number, height: number, tileSize: number,*/ collider: Collider | null) {

    this.tiles = tiles,
    this.collider = collider;
  }

  /*getRect(): Rect {
    return {
      x: this.x,
      y: this.y,
      width: this.screenWidth,
      height: this.screenHeight
    }
  }*/
}
