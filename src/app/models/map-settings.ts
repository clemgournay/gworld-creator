import { CharacterSettings } from './character-settings';
import { LayerSettings } from './layer-settings';

export class MapSettings {
  _id: string;
  title: string;
  width: number;
  height: number;
  tileSize: number;
  showGrid: boolean;
  dataURL: string;
  mainCharacter: CharacterSettings;
  layers: Array<LayerSettings>;
}
