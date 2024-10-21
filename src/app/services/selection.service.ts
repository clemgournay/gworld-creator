import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { TilesetService } from '@services/tileset.service';

import { Tileset } from '@models/tileset';
import { Area } from '@models/area';

@Injectable({
  providedIn: 'root',
})

export class SelectionService {

  area: Area;
  tilesetChanged: Subject<Tileset>;

  constructor(private tilesetService: TilesetService) {
    this.tilesetChanged = this.tilesetService.getChanges();
    const tileset = this.tilesetService.getCurrent();
    this.area = {
      i: 0,
      j: 0,
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      screenWidth: tileset.tileSize,
      screenHeight: tileset.tileSize
    }
    this.tilesetChanged.subscribe(() => {
      this.area = {
        i: 0,
        j: 0,
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        screenWidth: tileset.tileSize,
        screenHeight: tileset.tileSize
      }
    })

  }

  getArea(): Area {
    return this.area;
  }

  updatePosition(i: number, j: number): void {
    const tileset = this.tilesetService.getCurrent();
    this.area.i = i
    this.area.j = j;
    this.area.x = i * tileset.tileSize;
    this.area.y = j * tileset.tileSize;
  }

  updateSize(width: number, height: number): void {
    const tileset = this.tilesetService.getCurrent();
    this.area.width = width;
    this.area.height = height;
    this.area.screenWidth = width * tileset.tileSize;
    this.area.screenHeight = height * tileset.tileSize;
  }

  getContent(): any {
    const content: any = {};
    for (let i = 0; i < this.area.width; i++) {
      for (let j = 0; j < this.area.height; j++) {
        content[`${i}-${j}`] = `${this.area.i + i}-${this.area.j + j}`;
      }
    }
    return content;
  }
}
