import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { SharedModule } from '@shared/shared.module';

import { ParseCoordinates } from '@utils/coordinates';

import { Grid } from '@classes/grid';

import { Area } from '@models/area';
import { Coordinate } from '@models/coordinate';
import { TileContent } from '@models/tile-content';
import { Tileset } from '@models/tileset';
import { Character } from '@models/character';
import { Map } from '@models/map';


import { SelectionService } from '@services/selection.service';
import { TilesetService } from '@services/tileset.service';
import { MapService } from '@services/map.service';
import { ToolService } from '@services/tool.service';
import { MainCharacter } from '@classes/main-character';
import { CharsetService } from '@services/charset.service';
import { CharacterService } from '@services/character.service';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

  @Input('grid') grid: Grid;

  @ViewChild('mapEl') mapEl: ElementRef;
  ctx: CanvasRenderingContext2D;

  mapChanged: Subject<Map>;
  tilesetChanged: Subject<Tileset>;

  mousePos: {i: number, j: number, x: number, y: number};

  mode: string = 'idle';

  mainCharacter: MainCharacter;

  constructor(
    private mapService: MapService,
    private tilesetService: TilesetService,
    private selectionService: SelectionService,
    private charsetService: CharsetService,
    private characterService: CharacterService,
    private toolService: ToolService
  ) {
    this.mousePos = {i: 0, j: 0, x: 0, y: 0};
    this.mapChanged = this.mapService.getChanges();
    this.tilesetChanged = this.tilesetService.getChanges();

    this.mapChanged.subscribe((newMap: Map) => {
      this.mapEl.nativeElement.width = newMap.screenWidth;
      this.mapEl.nativeElement.height = newMap.screenHeight;
      console.log('CHANGED');
      this.draw();
      setTimeout(() => {
        this.draw();
      });
    });

    this.tilesetChanged.subscribe((tileset: Tileset) => {
      this.draw();
    });

  }

  async ngAfterViewInit(): Promise<void> {
    const map = this.mapService.getCurrent();
    this.ctx = this.mapEl.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.mapEl.nativeElement.width = map.screenWidth;
    this.mapEl.nativeElement.height = map.screenHeight;
    this.draw();
  }

  draw(): void {
    const map = this.mapService.getCurrent();
    this.ctx.clearRect(0, 0, map.screenWidth, map.screenHeight);
    this.drawTiles();

    if (map.showGrid) this.drawGrid();
  }

  drawTiles(): void {
    const map = this.mapService.getCurrent();
    for (let layer of this.grid.getLayers()) {
      const tiles = layer.getTiles();
      for (let coor in tiles) {
        const tile = tiles[coor];
        const content = tile.content;
        if (content) {
          const tileset = this.tilesetService.getByID(content.tileset);
          if (tileset) {
            this.ctx.drawImage(
              tileset.img,
              content.i * tileset.tileSize, content.j * tileset.tileSize,
              tileset.tileSize, tileset.tileSize,
              tile.i * map.tileSize, tile.j * map.tileSize,
              map.tileSize, map.tileSize
            );
          }

        }
      }

    }

  }

  drawCharacters(): void {
    const charset = this.charsetService.getCurrent();
    console.log(charset);
    this.ctx.drawImage(charset.img, 0, 0, charset.spriteWidth, charset.spriteWidth, 0, 0, charset.spriteWidth, charset.spriteHeight);
  }

  getCharacters(): Array<Character> {
    return this.characterService.getAll();
  }

  drawGrid(): void {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#2b2b2b';
    const map = this.mapService.getCurrent();

    for (let i = 0; i < map.screenWidth; i += map.tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, map.screenHeight);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    for (let j = 0; j < map.screenHeight; j += map.tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, j);
      this.ctx.lineTo(map.screenWidth, j);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  getMap(): Map {
    return this.mapService.getCurrent();
  }

  onMouseDown(e: MouseEvent): void {
    const tool = this.toolService.getCurrent();

    switch (tool.id) {
      case 'brush':
        this.mode = 'painting';
        this.paint();
      break;

      case 'bucket':
        this.bucketPaint();
      break;

      case 'eraser':
        this.mode = 'erasing';
        this.eraseSelection();
      break;
    }


  }

  onMouseMove(e: MouseEvent): void {
    const map = this.mapService.getCurrent();
    const rect = this.mapEl.nativeElement.getBoundingClientRect();
    const left = e.pageX - rect.left;
    const top = e.pageY - rect.top;
    this.mousePos.i = Math.floor(left / map.tileSize);
    this.mousePos.j = Math.floor(top / map.tileSize);
    this.mousePos.x = this.mousePos.i * map.tileSize;
    this.mousePos.y = this.mousePos.j * map.tileSize;

    switch (this.mode) {
      case 'painting':
        this.paint();
      break;

      case 'erasing':
        this.eraseSelection();
      break;
    }

  }

  onMouseUp(e: MouseEvent): void {
    this.mode = 'idle';
  }

  onMouseLeave(): void {
    this.mode = 'idle';
  }

  paint(): void {
    const content = this.selectionService.getContent();
    const selection = this.selectionService.getArea();
    const tileset = this.tilesetService.getCurrent();
    const startI = this.mousePos.i;
    const startJ = this.mousePos.j;
    let selectI = 0, selectJ = 0;
    for (let i = startI; i < startI + selection.width; i++) {
      selectJ = 0;
      for (let j = startJ; j < startJ + selection.height; j++) {
        const selectCoor: string = `${selectI}-${selectJ}`;
        const contentCoor: string = content[selectCoor];
        const coordinates: Coordinate = ParseCoordinates(contentCoor);
        const collider: boolean = tileset.colliders !== undefined && tileset.colliders.indexOf(contentCoor) >= 0;
        const tileContent: TileContent = {tileset: tileset._id, i: coordinates.i, j: coordinates.j, collider};
        if (this.grid.tileExists(i, j)) {
          this.grid.updateTileContent(i, j, tileContent);
        }
        selectJ++;
      }
      selectI++;
    }
    this.draw();
  }

  bucketPaint(): void {
    const map = this.mapService.getCurrent();
    const content = this.selectionService.getContent();
    const selection = this.selectionService.getArea();
    const tileset = this.tilesetService.getCurrent();
    let selectI = 0, selectJ = 0;

    for (let i = 0; i < map.width; i++) {
      selectJ = 0;
      for (let j = 0; j < map.height; j++) {
        const selectCoor: string = `${selectI}-${selectJ}`;
        const contentCoor: string = content[selectCoor];
        const coordinates: Coordinate = ParseCoordinates(contentCoor);
        const collider: boolean = tileset.colliders !== undefined && tileset.colliders.indexOf(contentCoor) >= 0;
        const tileContent: TileContent = {tileset: tileset._id, i: coordinates.i, j: coordinates.j, collider};
        this.grid.updateTileContent(i, j, tileContent);
        selectJ++;
        if (selectJ >= selection.height) selectJ = 0;
      }
      selectI++;
      if (selectI >= selection.width) selectI = 0;
    }
    this.draw();
  }

  eraseSelection(): void {
    const selection = this.selectionService.getArea();
    const startI = this.mousePos.i;
    const startJ = this.mousePos.j;
    for (let i = startI; i < startI + selection.width; i++) {
      for (let j = startJ; j < startJ + selection.height; j++) {
        if (this.grid.tileExists(i, j)) {
          this.grid.updateTileContent(i, j);
        }
      }
    }
    this.draw();
  }

  eraseLayer(): void {
    const map = this.mapService.getCurrent();
    for (let i = 0; i < map.width; i++) {
      for (let j = 0; j < map.height; j++) {
        this.grid.updateTileContent(i, j);
      }
    }
    this.draw();
  }

  getCurrentTileset(): Tileset {
    return this.tilesetService.getCurrent();
  }

  getCursorArea(): Area {
    const selection = this.selectionService.getArea();
    const map = this.mapService.getCurrent();

    return {
      i: this.mousePos.i,
      j: this.mousePos.j,
      x: this.mousePos.x,
      y: this.mousePos.y,
      width: selection.width,
      height: selection.height,
      screenWidth: selection.width * map.tileSize,
      screenHeight: selection.height * map.tileSize
    }
  }

  getCursorBackgroundPosition(): string {
    const tileset = this.tilesetService.getCurrent();
    const map = this.mapService.getCurrent();
    const selection = this.selectionService.getArea();
    const ratio = map.tileSize / tileset.tileSize;
    let pos = (-selection.x * ratio) + 'px ' + (-selection.y * ratio) + 'px';
    return pos;
  }

  getCursorBackgroundSize(): string {
    const tileset = this.tilesetService.getCurrent();
    const map = this.mapService.getCurrent();
    const ratio = map.tileSize / tileset.tileSize;
    let size = (tileset.screenWidth * ratio) + 'px ' +  (tileset.screenHeight * ratio) + 'px';
    return size;
  }

  getCharacterBackgroundSize(character: Character): string {
    const charset = character.charset;
    const map = this.mapService.getCurrent();
    const ratioW = map.tileSize / charset.spriteWidth;
    const ratioH = map.tileSize / charset.spriteHeight
    let size = (charset.screenWidth * ratioW) + 'px ' +  (charset.screenHeight * ratioH) + 'px';
    return size;
  }

  getLayerDataURL(index: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = this.mapEl.nativeElement.width;
    canvas.height = this.mapEl.nativeElement.height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const map = this.mapService.getCurrent();

    console.log('INDEX', index);
    const layer = this.grid.getLayer(index);
    const tiles = layer.getTiles();
    console.log('layer', layer);
    for (let coor in layer.tiles) {
      const tile = layer.tiles[coor];
      const content = tile.content;
      if (content) {
        const tileset = this.tilesetService.getByID(content.tileset);
        if (tileset) {
          ctx.drawImage(
            tileset.img,
            content.i * tileset.tileSize, content.j * tileset.tileSize,
            tileset.tileSize, tileset.tileSize,
            tile.i * map.tileSize, tile.j * map.tileSize,
            map.tileSize, map.tileSize
          );
        }

      }
    }
    return canvas.toDataURL();
  }


  async getPreviewDataURL(): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const dataURL = this.getDataURL();
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        canvas.width = 150;
        canvas.height = 150;
        ctx.drawImage(img, 0, 0, 150, 150);
        resolve(canvas.toDataURL());
      }
    });

  }

  getDataURL(): string {
    return this.mapEl.nativeElement.toDataURL();
  }

}
