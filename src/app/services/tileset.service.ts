import { Injectable } from '@angular/core';
import { TILESETS } from '@data/tilesets';
import { Tileset } from '@models/tileset';
import { FindItemByPropValue } from '@utils/array';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root',
})

export class TilesetService {

  tilesets: Array<Tileset> = TILESETS;
  current: Tileset;

  changes: Subject<Tileset>;

  constructor() {
    this.current = this.tilesets[0];
    this.changes = new Subject();
    this.processImage();
  }

  processImage(): void {
    this.current.img.src = this.current.src;
    this.current.img.onload = () => {
      this.current.screenWidth = this.current.img.width;
      this.current.screenHeight = this.current.img.height;
      this.current.width = Math.floor(this.current.img.width / this.current.tileSize);
      this.current.height = Math.floor(this.current.img.height / this.current.tileSize);
      console.log(this.current);
      this.changes.next(this.current);
    }
  }

  getAll(): Array<Tileset> {
    return this.tilesets;
  }

  getCurrent(): Tileset {
    return this.current;
  }

  getChanges(): Subject<Tileset> {
    return this.changes;
  }

  getByID(id: string): Tileset | null {
    return FindItemByPropValue(this.tilesets, 'id', id);
  }

  setCurrentByID(id: string): void {
    const tileset = FindItemByPropValue(this.tilesets, 'id', id);
    if (tileset) this.current = tileset;
    this.processImage();
  }

}
