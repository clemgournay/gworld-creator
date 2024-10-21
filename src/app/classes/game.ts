import { GameSettings } from '@models/game-settings';
import { View } from '@classes/view';
import { Map } from '@classes/map';
import { MainCharacter } from './main-character';
import { InputManager } from './input-manager';
import { Camera } from './camera';
import { Rect } from '@models/rect';
import { Intersects } from '@utils/geometry';
import { Tile } from './tile';

export class Game {

  screenWidth: number;
  screenHeight: number;
  settings: GameSettings;
  view: View;
  maps: Array<Map>;
  currentMap: Map;
  camera: Camera;
  inputManager: InputManager;
  helpers: boolean;

  constructor(settings: GameSettings) {
    this.settings = settings;
    this.screenWidth = settings.screenWidth;
    this.screenHeight = settings.screenHeight;
    this.view = new View(this);
    this.maps = [];
    this.inputManager = new InputManager(this);
    this.camera = new Camera(this);
    this.helpers = false;

    for (let mapSettings of this.settings.maps) {
      const map = new Map(this, mapSettings);
      this.maps.push(map);
    }
    this.currentMap = this.maps[0];
  }


  async run(): Promise<void> {
    await this.currentMap.load();
    this.update();
  }


  update(): void {
    this.currentMap.update();
    this.camera.update();
    this.view.update();

    requestAnimationFrame(() => {
      this.update();
    });

  };

  playerAboveObjectHitbox(index: number): boolean {
    const layers = this.currentMap.grid.layers;
    const layer = layers[index];
    let above = false;

    const mainCharacter = this.currentMap.mainCharacter;
    const hitboxRect = mainCharacter.getHitboxRect();

    for (let gameObject of layer.gameObjects) {

      let found = false, i = 0;
      while (!found && i < gameObject.tiles.length) {
        const tile = gameObject.tiles[i];
        if (tile.content && !tile.content.collider) {
          const rect = {x: tile.x, y: tile.y, width: tile.size, height: tile.size};

          //console.log(rect);
          if (Intersects(hitboxRect, rect)) {
            console.log('INSIDE OBJECT')
            found = true;
            above = true;
          } else {
            i++;
          }
        } else {
          i++;
        }
      }
      /*if (gameObject.collider) {
        if (Intersects(hitboxRect, gameObject.getRect())) {
          if (mainCharacter.y < gameObject.collider.y) {
            above = true;
          }
        }
      }*/
    }

    return above;
  }

  collides(x: number, y: number): string | null {
    let collisionSide = null;

    const characterRect = this.currentMap.mainCharacter.predictRect(x, y);

    const leftWallRect = {x: -1, y: -1, width: 1, height: this.currentMap.screenHeight};
    const topWallRect = {x: -1, y: -1, width: this.currentMap.screenWidth, height: 1};
    const rightWallRect = {x: this.currentMap.screenWidth, y: -1, width: 1, height: this.currentMap.screenHeight};
    const bottomWallRect = {x: -1, y: this.currentMap.screenHeight, width: this.currentMap.screenWidth, height: 1};

    const intersectionLeftWall = Intersects(characterRect, leftWallRect);
    const intersectionTopWall = Intersects(characterRect, topWallRect);
    const intersectionRightWall = Intersects(characterRect, rightWallRect);
    const intersectionBottomWall = Intersects(characterRect, bottomWallRect);

    if (intersectionLeftWall) collisionSide = intersectionLeftWall;
    else if (intersectionRightWall) collisionSide = intersectionRightWall;
    else if (intersectionTopWall) collisionSide = intersectionTopWall;
    else if (intersectionBottomWall) collisionSide = intersectionBottomWall;
    else collisionSide = this.collidesObject(x, y);

    return collisionSide;
  }

  collidesObject(x: number, y: number): string | null {
    let collisionSide = null;
    const hitboxRect = this.currentMap.mainCharacter.predictHitboxRect(x, y);
    const layers =  this.currentMap.grid.layers;
    let index = 0;
    for (let layer of layers) {
        const tiles = layer.tiles;
        const tile = layer.getTileAtPos(x, y);

        if (tile) {
            for (let i = tile.i - 1; i <= tile.i + 1; i++) {
                for (let j = tile.j - 1; j <= tile.j + 1; j++) {
                    const coor = `${i}-${j}`;

                    if (coor in tiles) {
                        const targetTile = tiles[coor];

                        if (targetTile.content && targetTile.content.collider) {
                            const targetTileRect = {
                                x: targetTile.x, y: targetTile.y,
                                width: this.currentMap.tileSize,
                                height: this.currentMap.tileSize
                            };

                            const intersectionSide = Intersects(hitboxRect, targetTileRect);

                            if (intersectionSide) {
                                collisionSide = intersectionSide;

                                /*const nextIndex = index + 1;
                                if (nextIndex in layers) {
                                    const nextLayer = layers[nextIndex];
                                    const nextTiles = nextLayer.tiles;
                                    if (coor in nextTiles && nextTiles[coor].content && !nextTiles[coor].content.collider) {
                                        collisionSide = null;
                                    }
                                }*/
                            }


                        }
                    }
                }
            }
            index++;
        }
    }
    return collisionSide;
  }

}
