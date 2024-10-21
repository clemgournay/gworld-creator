import { Character } from './character';
import { CharsetSettings } from '@models/charset-settings';
import { Game } from './game';
import { Map } from './map';

export class MainCharacter extends Character {

  screenX: number;
  screenY: number;

  constructor(game: Game, map: Map, i: number, j: number, charsetSettings: CharsetSettings) {
    super(game, map, i, j, charsetSettings);
    this.screenX = this.x;
    this.screenY = this.y;
  }


  update(): void {
    const controls = this.game.inputManager.controls;

    if (controls.RIGHT) {
      this.move('right');
    } else if (controls.LEFT) {
      this.move('left');
    }

    if (controls.UP) {
      this.move('up');
    } else if (controls.DOWN) {
      this.move('down');
    }

    if (Object.keys(controls).length > 0) this.charset.udpate();

  }


  override move(direction: string): void {
    const prevX = this.x;
    const prevY = this.y;
    super.move(direction);

    this.direction = direction;

    const halfScreenWidth = Math.round(this.game.screenWidth/2);
    const halfScreenHeight = Math.round(this.game.screenHeight/2);
    const startX = halfScreenWidth;
    const startY = halfScreenHeight;
    const endX = this.map.screenWidth - halfScreenWidth;
    const endY = this.map.screenHeight - halfScreenHeight;

    switch (direction) {
      case 'left':
        if (prevX != this.x) {
          if (this.x >= startX && this.x < endX) {
            this.screenX = halfScreenWidth;
          } else {
            this.screenX -= this.speed;
          }
        }
      break;

      case 'right':
        if (prevX != this.x) {
          if (this.x >= startX && this.x < endX) {
            this.screenX = halfScreenWidth;
          } else {
            this.screenX += this.speed;
          }
        }
      break;

      case 'up':
        if (prevY != this.y) {
          if (this.y >= startY && this.y < endY) {
            this.screenY = halfScreenHeight;
          } else {
            this.screenY -= this.speed;
          }
        }
      break;

      case 'down':
        if (prevY != this.y) {
          if (this.y >= startY  && this.y < endY) {
            this.screenY = halfScreenHeight;
          } else {
            this.screenY += this.speed;
          }
        }
      break;
    }
  }
}
