import { Layer } from './layer';

export class Map {
  _id: string;
  title: string;
  width: number;
  height: number;
  screenWidth: number;
  screenHeight: number;
  layers: Array<Layer> = [];
  tileSize: number;
  showGrid: boolean;
  preview?: string;
  game?: string;
}
