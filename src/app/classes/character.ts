import { CharsetSettings } from '@models/charset-settings';
import { Hitbox } from '@models/hitbox';

import { Charset } from './charset';
import { Game } from './game';
import { Map } from './map';
import { Rect } from '@models/rect';

export class Character {

  game: Game;
  map: Map;
  startI: number;
  startJ: number;
  x: number;
  y: number;
  charset: Charset;
  direction: string;
  speed: number;
  hitbox: Hitbox;


  constructor(game: Game, map: Map, i: number, j: number, charsetSettings: CharsetSettings) {
    this.game = game;
    this.map = map;
    this.startI = i;
    this.startJ = j;
    this.x = this.startI * map.tileSize;
    this.y = this.startJ * map.tileSize;
    this.speed = 1;
    this.charset = new Charset(this.game, charsetSettings);
    this.hitbox = charsetSettings.hitbox;
    this.direction = 'down';
  }


  async loadCharset(): Promise<void> {
    await this.charset.load();
  }

  move(direction: string): void {
    this.direction = direction;

    let newX = this.x, newY = this.y;
    switch (direction) {
      case 'left':
        newX = this.x - this.speed;
      break;

      case 'right':
        newX = this.x + this.speed;
      break;

      case 'up':
        newY = this.y - this.speed;
      break;

      case 'down':
        newY = this.y + this.speed;
      break;
    }

    if (!this.game.collides(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }

  }

  predictRect(x: number, y: number): Rect {
    const hitbox: Rect = {
      x, y,
      width: this.charset.spriteWidth,
      height: this.charset.spriteHeight
    };
    return hitbox;
  }

  predictHitboxRect(x: number, y: number): Rect {
    const rect: Rect = {
      x: x + this.hitbox.left,
      y: y + this.hitbox.top,
      width: this.hitbox.width,
      height: this.hitbox.height
    };
    return rect;
  }

  getHitboxRect(): Rect {
    const rect: Rect = {
      x: this.x + this.hitbox.left,
      y: this.y + this.hitbox.top,
      width: this.hitbox.width,
      height: this.hitbox.height
    };
    return rect;
  }

}
