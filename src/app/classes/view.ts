import { Game } from '@classes/game';
import { Layer } from './layer';
import { Rect } from '@models/rect';

export class View {

  game: Game;
  viewEl: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(game: Game) {
    this.game = game;
    this.viewEl = document.getElementById('view') as HTMLCanvasElement;
    this.ctx = this.viewEl.getContext('2d') as CanvasRenderingContext2D;
    this.viewEl.width = this.game.settings.screenWidth;
    this.viewEl.height = this.game.settings.screenHeight;
  }


  update(): void {
    this.draw();
  }

  draw(): void  {
    this.ctx.clearRect(0, 0, this.viewEl.width, this.viewEl.height);

    this.drawLayerAtIndex(0);

    if (this.game.playerAboveObjectHitbox(1)) {
      this.drawMainCharacter();
      this.drawLayerAtIndex(1);
    } else {
      this.drawLayerAtIndex(1);
      this.drawMainCharacter();
    }

    if (this.game.helpers) {
      this.drawColliders();
      this.drawGrid();
    }

  }


  drawLayerAtIndex(index: number): void {
    const layers = this.game.currentMap.grid.layers;
    const layer = layers[index];
    this.drawLayer(layer);
  }

  drawLayer(layer: Layer): void {
    const camera = this.game.camera;

    const map = this.game.currentMap;
    let targetX = camera.x;
    let targetY = camera.y;
    let targetW = this.game.screenWidth;
    let targetH = this.game.screenHeight;

    let destX = 0, destY = 0;
    let destW = this.viewEl.width;
    let destH = this.viewEl.height;

    if (map.screenWidth < this.game.screenWidth) {
      targetX = 0;
      targetW = map.screenWidth;
      destX = Math.round((this.game.screenWidth)/2 - (map.screenWidth/2));
      destW = map.screenWidth;
    }

    if (map.screenHeight < this.game.screenHeight) {
      targetY = 0;
      targetH = map.screenHeight;
      destY = Math.round((this.game.screenHeight/2) - (map.screenHeight/2));
      destH = map.screenHeight;
    }

    this.ctx.drawImage(
      layer.img,
      targetX, targetY,
      targetW, targetH,
      destX, destY,
      destW, destH
    );
  }

  drawColliders(): void {
    const grid = this.game.currentMap.grid;
    const camera = this.game.camera;
    for (let layer of grid.layers) {
      for (let coor in layer.tiles) {
        const tile = layer.tiles[coor];
        if (tile.content && tile.content.collider) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = 'red';
          this.ctx.rect(
            tile.x - camera.x,
            tile.y - camera.y,
            tile.size, tile.size
          );
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  }

  drawGrid(): void {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#2b2b2b';

    const camera = this.game.camera;
    const map = this.game.currentMap;

    for (let x = 0; x < map.screenWidth; x += map.tileSize) {
      let realX = x - camera.x;
      this.ctx.beginPath();
      this.ctx.moveTo(realX, 0);
      this.ctx.lineTo(realX, map.screenHeight);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    for (let y = 0; y < map.screenHeight; y += map.tileSize) {
      let realY = y - camera.y;
      this.ctx.beginPath();
      this.ctx.moveTo(0, realY);
      this.ctx.lineTo(map.screenWidth, realY);
      this.ctx.stroke();
      this.ctx.closePath();
    }

    for (let j = 0; j < map.height; j++) {
      for (let i = 0; i < map.width; i++) {
        const coor = `${i}-${j}`;
        let x = i * map.tileSize + (map.tileSize/2);
        let y = j * map.tileSize + (map.tileSize/2);
        let realX = x - camera.x;
        let realY = y - camera.y;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(coor, realX, realY);

      }
    }
  }

  drawMainCharacter(): void {
    const map = this.game.currentMap;
    const mainCharacter = this.game.currentMap.mainCharacter;
    const charset = mainCharacter.charset;
    let x = 0, y = 0;
    const directionIndex = charset.directions.indexOf(mainCharacter.direction);
    if (charset.orientation === 'vertical') {
      x = charset.currentFrame * charset.spriteWidth;
      y = directionIndex * charset.spriteHeight;
    } else {
      x = directionIndex * charset.spriteWidth;
      y = charset.currentFrame * charset.spriteHeight;
    }
    this.ctx.drawImage(
      charset.img,
      x, y,
      charset.spriteWidth, charset.spriteHeight,
      mainCharacter.screenX, mainCharacter.screenY,
      map.tileSize, map.tileSize
    );

    if (this.game.helpers) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'purple';
      this.ctx.rect(
        mainCharacter.screenX,
        mainCharacter.screenY,
        charset.spriteWidth,
        charset.spriteHeight
      );
      this.ctx.stroke();
      this.ctx.closePath();

      this.ctx.beginPath();
      this.ctx.strokeStyle = 'blue';
      this.ctx.rect(
        mainCharacter.screenX + mainCharacter.hitbox.left,
        mainCharacter.screenY + mainCharacter.hitbox.top,
        mainCharacter.hitbox.width, mainCharacter.hitbox.height
      );
      this.ctx.stroke();
      this.ctx.closePath();
    }

  }

}
