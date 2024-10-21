export class Tileset {
  id: string;
  src: string;
  width: number;
  height: number;
  screenWidth: number;
  screenHeight: number;
  tileSize: number;
  img: HTMLImageElement;
  colliders?: Array<string>;
}
