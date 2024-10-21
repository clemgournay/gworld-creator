import { Hitbox } from './hitbox';

export class Charset {
  id: string;
  src: string;
  spriteWidth: number;
  spriteHeight: number;
  screenWidth: number;
  screenHeight: number;
  orientation: string;
  hitbox: Hitbox;
  directions: Array<string>;
  img: HTMLImageElement;
}
