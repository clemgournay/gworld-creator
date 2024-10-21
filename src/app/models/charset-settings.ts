import { Hitbox } from './hitbox';

export class CharsetSettings {
  id: string;
  src: string;
  spriteWidth: number;
  spriteHeight: number;
  orientation: string;
  directions: Array<string>;
  hitbox: Hitbox
}
