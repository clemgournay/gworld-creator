import { TileContent } from '@models/tile-content';

export class Tile {

  i: number;
  j: number;
  x: number;
  y: number;
  size: number;
  content: TileContent | null;

  constructor(i: number, j: number, size: number, content: TileContent | null = null) {
    this.i = i;
    this.j = j;
    this.x = i * size;
    this.y = j * size;
    this.size = size;
    this.content = content;
  }

  updateContent(content: TileContent | null) {
    this.content = content;
  }

}
