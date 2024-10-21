import { MapSettings } from '@models/map-settings';
import { Game } from '@classes/game';
import { MainCharacter } from './main-character';
import { Grid } from './grid';
import { ParseCoordinates } from '@utils/coordinates';

export class Map {

  game: Game;
  width: number;
  height: number;
  screenWidth: number;
  screenHeight: number;
  tileSize: number;
  settings: MapSettings;
  grid: Grid;

  mainCharacter: MainCharacter;

  constructor(game: Game, settings: MapSettings) {
    this.game = game;
    this.settings = settings;
    this.width = settings.width;
    this.height = settings.height;
    this.tileSize = settings.tileSize;
    this.screenWidth = this.width * this.tileSize;
    this.screenHeight = this.height * this.tileSize;
    this.grid = new Grid(settings.width, settings.height, settings.tileSize);

    for (let x = 0; x < settings.layers.length; x++) {
      const tiles = settings.layers[x].tiles;
      this.grid.setLayerDataURL(x, settings.layers[x].dataURL);
      for (let coor in tiles) {
        const content = tiles[coor];
        const coordinates = ParseCoordinates(coor);
        this.grid.updateTileContentInLayer(x, coordinates.i, coordinates.j, content);
      }
    }

    this.grid.buildGameObjects();
    this.mainCharacter = new MainCharacter(game, this, settings.mainCharacter.i, settings.mainCharacter.j, settings.mainCharacter.charset);
  }

  async load(): Promise<void> {
    for (let layer of this.grid.layers) {
      await layer.loadIMG();
    }
    await this.mainCharacter.loadCharset();
  }

  update(): void {
    this.mainCharacter.update();
  }



}
