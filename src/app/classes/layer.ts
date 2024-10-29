
import { Tile } from './tile';
import { GameObject } from './game-object';

import { TileContent } from '@models/tile-content';
import { Rect } from '@models/rect';
import { FindIndexByPropValue } from '@utils/array';
import { Collider } from './collider';
import { Area } from '@models/area';


export class Layer {

  index: number;
  name: string;
  width: number;
  height: number;
  tileSize: number;
  tiles: any;
  dataURL: string;
  img: HTMLImageElement;
  gameObjects: Array<GameObject>;

  constructor(index: number, name: string, width: number, height: number, tileSize: number) {
    this.index = index;
    this.name = name;
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.tiles = {};
    this.dataURL = '';
    this.img = new Image();
    this.gameObjects = [];
    this.buildGrid();
  }

  buildGrid(): void {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let coor: string = `${i}-${j}`;
        this.tiles[coor] = new Tile(i, j, this.tileSize);
      }
    }
  }

  buildGameObjects(): void {
    if (this.index === 1) console.log('BUILD GO')
    this.gameObjects = [];

    let contentTiles = [];
    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width; i++) {
        const coor = `${i}-${j}`;
        const tile = this.tiles[coor];
        if (tile.content) {
          contentTiles.push(tile);
        }
      }
    }

    if (contentTiles.length > 0) {
      contentTiles[0].added = true;
      let groups: Array<Array<Tile>> = [[contentTiles[0]]];

      for (let tile of contentTiles) {
        if (!tile.added) {

          let found = false;
          let x = 0, i = 0;
          while (!found && x < groups.length) {
            const group = groups[x];
            i = 0;
            while (!found && i < group.length) {
              let groupTile = group[i];
              let isTopTile = tile.i === groupTile.i && tile.j === groupTile.j-1;
              let isLeftTile = tile.i === groupTile.i-1 && tile.j === groupTile.j;
              let isRightTile = tile.i === groupTile.i+1 && tile.j === groupTile.j;
              let isBottomTile = tile.i === groupTile.i && tile.j == groupTile.j+1;

              if (isTopTile || isLeftTile || isRightTile || isBottomTile) {
                tile.added = true;
                group.push(tile);
                found = true;
              } else {
                i++;
              }

            }
            if (!found) {
              x++;
            }
          }
          if (!found) {
            tile.added = true;
            const newGroup = [tile];
            groups.push(newGroup);
          }

        }
      }

      if (this.index === 1) console.log('GROUPS', groups);
      for (let group of groups) {
        let colliderTiles = [];

        for (let tile of group) {
          if (tile.content && tile.content.collider) {
            colliderTiles.push(tile);
          }
        }
        const collider = new Collider(colliderTiles);
        const gameObject = new GameObject(group, collider);
        this.gameObjects.push(gameObject);

      }

    }
  }

  updateTileContent(i: number, j: number, content: TileContent | null = null): void {
    const coor = `${i}-${j}`;
    this.tiles[coor].updateContent(content);
  }

  tileExists(i: number, j: number): boolean {
    const coor = `${i}-${j}`;
    return coor in this.tiles;
  }

  getTiles(): any {
    return this.tiles;
  }

  getTileAtCoor(i: number, j: number): Tile {
    const coor = `${i}-${j}`;
    return this.tiles[coor];
  }

  getTileAtPos(x: number, y: number): Tile {
    const i = Math.floor(x / this.tileSize);
    const j = Math.floor(y / this.tileSize);
    return this.getTileAtCoor(i, j);
  }

  updateWidth(newWidth: number): void {
    const diff = newWidth - this.width;

    if (diff > 0) {
      for (let i = this.width; i <= newWidth; i++) {
        for (let j = 0; j < this.height; j++) {
          const coor = `${i}-${j}`;
          this.tiles[coor] = new Tile(i, j, this.tileSize);
        }
      }
    } else if (diff < 0) {
      for (let i = newWidth; i <= this.width; i++) {
        for (let j = 0; j < this.height; j++) {
          const coor = `${i}-${j}`;
          delete this.tiles[coor];
        }
      }
    }

    this.width = newWidth;
  }

  updateHeight(newHeight: number): void {
    const diff = newHeight - this.height;

    if (diff > 0) {
      for (let i = 0; i < this.width; i++) {
        for (let j = this.height; j <= newHeight; j++) {
          const coor = `${i}-${j}`;
          this.tiles[coor] = new Tile(i, j, this.tileSize);
        }
      }
    } else if (diff < 0) {
      for (let i = 0; i < this.width; i++) {
        for (let j = newHeight; j <= this.height; j++) {
          const coor = `${i}-${j}`;
          delete this.tiles[coor];
        }
      }
    }

    this.height = newHeight;
  }

  updateTileSize(newTileSize: number): void {
    this.tileSize = newTileSize;
    for (let coor in this.tiles) {
      this.tiles[coor].updateSize(newTileSize);
    }
  }

  setDataURL(dataURL: string): void {
    this.dataURL = dataURL;
  }

  async loadIMG(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.img.src = this.dataURL;
      this.img.onload = () => {
        resolve();
      };
    })
  }

  isSameContent(tileA: Tile, tileB: Tile) {
    let same = true;
    if (tileA.content && tileB.content) {
      if (
        tileA.content.tileset !== tileB.content.tileset ||
        tileA.content.i !== tileB.content.i ||
        tileA.content.j !== tileB.content.j
      ) {
        same = false;
      }
    } else {
      same = false;
    }
    return same;
  }

  /*getObjectAreaAtTile(tile: Tile): Area {

    let i = tile.i, j = tile.j;
    let changedTile = false;
    let maxTileX = tile;
    while (!changedTile && i < this.width) {
      let curTile = this.getTileAtCoor(i, j);
      maxTileX = curTile;
      if (!curTile.content) {
        changedTile = true;
      } else {
        maxTileX = curTile;
        i++;
      }
    }

    changedTile = false;
    i = tile.i, j = tile.j;
    let minTileX = tile;
    while (!changedTile && i > 0) {
      let curTile = this.getTileAtCoor(i, j);
      if (!curTile.content) {
        changedTile = true;
      } else {
        minTileX = curTile;
        i--;
      }
    }


    changedTile = false;
    i = tile.i, j = tile.j;
    let maxTileY = tile;
    while (!changedTile && j < this.height) {
      let curTile = this.getTileAtCoor(i, j);
      if (!curTile.content) {
        changedTile = true;
      } else {
        maxTileY = curTile;
        j++;
      }
    }

    changedTile = false;
    i = tile.i, j = tile.j;
    let minTileY = tile;
    while (!changedTile && j > 0) {
      let curTile = this.getTileAtCoor(i, j);
      if (!curTile.content) {
        changedTile = true;
      } else {
        minTileY = curTile;
        j--;
      }
    }

    let iValues = [minTileX.i, maxTileX.i, minTileY.i, maxTileY.i];
    let jValues = [minTileX.j, maxTileX.j, minTileY.j, maxTileY.j]
    let minI = Math.min.apply(iValues);
    let minJ = Math.min.apply(jValues);
    let maxI = Math.max.apply(iValues);
    let maxJ = Math.max.apply(jValues);

    let area: Area = {
      i: minTileX.i,
      j: minTileX.j,
      width: (maxTileX.i - minTileX.i),
      height: (maxTileY.j - minTileY.j),
      x: minTileX.x,
      y: minTileX.y,
      screenWidth: 0,
      screenHeight: 0
    };

    //if (this.index === 1) console.log('MAX TILE', maxTileX);

    area.screenWidth = area.width * this.tileSize;
    area.screenHeight = area.height * this.tileSize;

    return area;
  }

/*
  getColliderAreaAtTile(tile: Tile): Area {

    let i = tile.i, j = tile.j;
    let changedTile = false;
    let maxTileX = tile;
    while (!changedTile && i < this.width) {
      let curTile = this.getTileAtCoor(i, j);
      if (!curTile.content || (curTile.content && !curTile.content.collider)) {
        changedTile = true;
      } else {
        maxTileX = curTile;
        i++;
      }
    }

    changedTile = false;
    i = tile.i, j = tile.j;
    let minTileX = tile;
    while (!changedTile && i > 0) {
      let curTile = this.getTileAtCoor(i, j);
      if (!curTile.content || (curTile.content && !curTile.content.collider)) {
        changedTile = true;
      } else {
        minTileX = curTile;
        i--;
      }
    }

    changedTile = false;
    i = tile.i, j = tile.j;
    let maxTileY = tile;
    while (!changedTile && j < this.height) {
      let curTile = this.getTileAtCoor(i, j);
      if (!curTile.content || (curTile.content && !curTile.content.collider)) {
        changedTile = true;
      } else {
        maxTileY = curTile;
        j++;
      }
    }

    changedTile = false;
    i = tile.i, j = tile.j;
    let minTileY = tile;
    while (!changedTile && j > 0) {
      let curTile = this.getTileAtCoor(i, j);
      if (!curTile.content || (curTile.content && !curTile.content.collider)) {
        changedTile = true;
      } else {
        minTileY = curTile;
        j--;
      }
    }

    let area: Area = {
      i: minTileX.i,
      j: minTileX.j,
      width: (maxTileX.i - minTileX.i) + 1,
      height: (maxTileY.j - minTileY.j) + 1,
      x: minTileX.x,
      y: minTileX.y,
      screenWidth: 0,
      screenHeight: 0
    };
    area.screenWidth = area.width * this.tileSize;
    area.screenHeight = area.height * this.tileSize;


    return area;
  }*/


}
