import { Game } from './game';

export class InputManager {

  game: Game;
  controls: any;

  constructor(game: Game) {
    this.controls = {};
    this.events();
  }


  events(): void {

    document.onkeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          this.controls.UP = true;
        break;
        case 'ArrowLeft':
          this.controls.LEFT = true;
        break;
        case 'ArrowRight':
          this.controls.RIGHT = true;
        break;
        case 'ArrowDown':
          this.controls.DOWN = true;
        break;
      }
    }

    document.onkeyup = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          delete this.controls.UP;
        break;
        case 'ArrowLeft':
          delete this.controls.LEFT;
        break;
        case 'ArrowRight':
          delete this.controls.RIGHT;
        break;
        case 'ArrowDown':
          delete this.controls.DOWN;
        break;
      }
    }

  }

}
