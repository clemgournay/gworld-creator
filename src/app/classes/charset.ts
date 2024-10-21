import { Game } from '@classes/game';
import { CharsetSettings } from '@models/charset-settings';
import { Hitbox } from '@models/hitbox';

export class Charset {

  game: Game;
  settings: CharsetSettings;
  nbFrames: number;
  spriteWidth: number;
  spriteHeight: number;
  directions: Array<string>;
  orientation: string;
  hitbox: Hitbox;
  currentFrame: number;
  img: HTMLImageElement;
  lastFrameDate: Date;
  frameInterval: number = 100;

  constructor(game: Game, settings: CharsetSettings) {
    this.game = game;
    this.settings = settings;
    this.nbFrames = 0;
    this.spriteWidth = settings.spriteWidth;
    this.spriteHeight = settings.spriteHeight;
    this.directions = settings.directions;
    this.orientation = settings.orientation;
    this.hitbox = settings.hitbox;
    this.currentFrame = 0;
    this.lastFrameDate = new Date();
  }

  async load(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.img = new Image();
      this.img.src = this.settings.src;
      this.img.onload = () => {
        if (this.orientation === 'vertical') {
          this.nbFrames = Math.floor(this.img.width / this.spriteWidth);
        } else {
          this.nbFrames = Math.floor(this.img.height / this.spriteHeight);
        }
        resolve();
      }
    });
  }

  udpate(): void {
    const date = new Date();
    const ellapsedTime = date.getTime() - this.lastFrameDate.getTime();
    if (ellapsedTime >= this.frameInterval) {
      this.currentFrame++;
      if (this.currentFrame === this.nbFrames) {
        this.currentFrame = 0;
      }
      this.lastFrameDate = date;
    }

  }

}
