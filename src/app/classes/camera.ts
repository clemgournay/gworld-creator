import { Game } from './game';

export class Camera {

  game: Game;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(game: Game, x: number = 0, y: number = 0) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = this.game.screenWidth;
    this.height = this.game.screenHeight;
  }

  update() {

    const map = this.game.currentMap;
    const mainCharacter = map.mainCharacter;

    /*if (map.screenWidth < this.game.screenWidth) {
      //this.x = Math.round((this.game.screenWidth/2) - (map.screenWidth/2));
    } else {*/

      const halfScreenWidth = Math.round(this.game.screenWidth/2)
      const startFollowingX = halfScreenWidth;
      const endFollowingX = Math.round(map.screenWidth - halfScreenWidth);
      if (mainCharacter.x >= startFollowingX && mainCharacter.x <= endFollowingX) {
        this.x = Math.round(map.mainCharacter.x - halfScreenWidth);
      }
    //}

    /*console.log(map.screenHeight, this.game.screenHeight)
    if (map.screenHeight < this.game.screenHeight) {
      const diff = this.game.screenHeight - map.screenHeight;
      this.y = -diff;*/
    /*} else {*/
      const halfScreenHeight = Math.round(this.game.screenHeight/2)
      const startFollowingY = halfScreenHeight;
      const endFollowingY = Math.round(map.screenHeight - halfScreenHeight);
      if (mainCharacter.y >= startFollowingY && mainCharacter.y <= endFollowingY) {
        this.y = Math.round(map.mainCharacter.y - halfScreenHeight);
      }
    //}
  }

}
