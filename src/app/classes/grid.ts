import { TileContent } from '@models/tile-content';

import { Layer } from './layer';
import { Tile } from './tile';

export class Grid {

  width: number;
  height: number;
  tileSize: number;

  nbLayers: number;
  layers: Array<Layer>;
  currentLayer: Layer;
  tiles: any;

  constructor(width: number, height: number, tileSize: number, nbLayers: number = 3) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.nbLayers = nbLayers;
    this.layers = [];
    this.buildLayers();
  }

  buildLayers(): void {
    this.layers = [];
    for (let x = 0; x < this.nbLayers; x++) {
      let name = `Layer ${x+1}`;
      const layer = new Layer(x, name, this.width, this.height, this.tileSize);
      this.layers.push(layer);
    }
    this.currentLayer = this.layers[0];
  }

  updateSize(width: number, height: number, tileSize: number): void {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;

    for (let layer of this.layers) {
      layer.updateWidth(width);
      layer.updateHeight(height);
      layer.updateTileSize(tileSize);
    }

  }

  buildGameObjects(): void {
    for (let layer of this.layers) {
      layer.buildGameObjects();
    }
  }

  updateTileContent(i: number, j: number, content: TileContent | null = null): void {
    this.currentLayer.updateTileContent(i, j, content);
  }

  updateTileContentInLayer(index: number, i: number, j: number, content: TileContent | null = null): void {
    this.layers[index].updateTileContent(i, j, content);
  }

  setLayerDataURL(index: number, dataURL: string): void {
    this.layers[index].setDataURL(dataURL);
  }

  getTiles(): any {
    return this.currentLayer.tiles;
  }

  getTilesArray(): Array<Tile> {
    let tiles = [];
    for (let coor in this.currentLayer.tiles) {
      tiles.push(this.currentLayer.tiles[coor]);
    }
    return tiles;
  }

  tileExists(i: number, j: number): boolean {
    return this.currentLayer.tileExists(i, j);
  }

  getTileAtCoor(i: number, j: number): Tile {
    return this.currentLayer.getTileAtCoor(i, j);
  }

  getTileAtPos(x: number, y: number): Tile {
    return this.currentLayer.getTileAtCoor(x, y);
  }

  getLayers(): Array<Layer> {
    return this.layers;
  }

  getLayer(index: number): Layer {
    return this.layers[index];
  }

  getCurrentLayer(): Layer {
    return this.currentLayer;
  }

  switchLayer(layer: Layer): void {
    this.currentLayer = layer;
  }
}
