import { Tile } from './tile';

export class Collider {

  tiles: Array<Tile> = [];

  constructor(tiles: Array<Tile>) {
    this.tiles = tiles;
  }
}
