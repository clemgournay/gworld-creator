import { MapSettings } from './map-settings';

export class GameSettings {
  _id: string;
  title: string;
  screenWidth: number;
  screenHeight: number;
  maps: Array<MapSettings>;
}
