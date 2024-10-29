import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { last, lastValueFrom, Subject, Subscription } from 'rxjs';

import { SharedModule } from '@shared/shared.module';

import { Grid } from '@classes/grid';

import { Map } from '@models/map';

import { MapService } from '@services/map.service';
import { GameService } from '@services/game.service';
import { MapSettings } from '@models/map-settings';
import { GameSettings } from '@models/game-settings';
import { ParseCoordinates } from '@utils/coordinates';
import { CharsetService } from '@services/charset.service';
import { CharacterService } from '@services/character.service';

import { HeaderComponent } from '@components/parts/header/header.component';
import { toolbarComponent } from '@components/parts/toolbar/toolbar.component';
import { MapComponent } from '@components/parts/map/map.component';
import { MapbarComponent } from '@components/parts/mapbar/mapbar.component';
import { APIResp } from '@models/api-resp';
import { AppService } from '@services/app.service';
import { TilesetService } from '@services/tileset.service';
import { MusicEditionComponent } from '@components/modals/music-edition/music-edition.component';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    HeaderComponent,
    toolbarComponent,
    MapComponent,
    MapbarComponent,
    MusicEditionComponent
  ],
  templateUrl: './map-editor.component.html',
  styleUrl: './map-editor.component.scss'
})
export class MapEditorComponent {

  initStateSub: Subscription;
  grid: Grid;
  mapChanged: Subject<Map>;
  gameSettings: GameSettings;

  tilesetsToLoad: Array<string> = [];

  gameID: string = 'new';
  mapID: string = 'new';

  @ViewChild('mapComp') mapComp: MapComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private gameService: GameService,
    private mapService: MapService,
    private tilesetService: TilesetService,
    private charsetService: CharsetService,
    private characterService: CharacterService
  ) {
    this.mapChanged = this.mapService.getChanges();

    const state = history.state;

    if (state.gameSettings) {
      const gameSettings = state.gameSettings;
      const mapSettings = gameSettings.maps[0];
      this.buildMapFromSettings(mapSettings);
    } else {
      const map = this.mapService.getCurrent();
      this.grid = new Grid(map.width, map.height, map.tileSize)
    }

    this.mapChanged.subscribe((newMap: Map) => {
      this.grid.updateSize(newMap.width, newMap.height, newMap.tileSize);
    });
  }

  ngOnInit(): void {
    this.initStateSub = this.appService.getInitState().subscribe((state: boolean) => {
      if (state) this.loadingComplete();
    });
  }


  async loadingComplete(): Promise<void> {
    const gameID = this.route.snapshot.paramMap.get('game-id');
    const mapID = this.route.snapshot.paramMap.get('map-id');

    this.tilesetService.retrieveAll().subscribe((resp: APIResp) => {
      const tilesets = resp.data;
      console.log('[TILESETS]', tilesets);
      this.tilesetService.setAll(tilesets);
    });

    if (gameID) {
      this.gameID = gameID;
      this.gameService.updateID(gameID);
      const game$ = this.gameService.getOne(gameID);
      const resp: APIResp = await lastValueFrom(game$);
      this.gameService.setCurrent(resp.data);
    }
    if (mapID) {
      this.mapID = mapID;
      this.mapService.updateID(this.mapID);

      if (this.mapID !== 'new') {
        const map$ = this.mapService.getOne(mapID);
        const resp: APIResp = await lastValueFrom(map$);
        const mapSettings = resp.data;

        this.mapService.getLayers(mapID).subscribe(async (resp: APIResp) => {
          mapSettings.layers = resp.data;
          console.log('[MAP SETTINGS FROM SERVER]', mapSettings);
          this.buildMapFromSettings(mapSettings);
          await this.loadAssets();
          setTimeout(() => {
            this.mapComp.draw();
          })
        });
      }
    }
  }

  buildMapFromSettings(mapSettings: MapSettings): void {
    this.tilesetsToLoad = [];
    this.mapService.updateWidth(mapSettings.width, false);
    this.mapService.updateHeight(mapSettings.height, false);
    this.mapService.updateTileSize(mapSettings.tileSize, false);
    this.mapService.updateTitle(mapSettings.title);
    if (!mapSettings.showGrid) this.mapService.hideGrid();

    this.grid = new Grid(mapSettings.width, mapSettings.height, mapSettings.tileSize);
    let layers = [];
    for (let x = 0; x < mapSettings.layers.length; x++) {
      const tiles = mapSettings.layers[x].tiles ? mapSettings.layers[x].tiles : mapSettings.layers[x];
      layers.push(tiles);
      for (let coor in tiles) {
        const content = tiles[coor];
        const coordinates = ParseCoordinates(coor);
        this.grid.updateTileContentInLayer(x, coordinates.i, coordinates.j, content);
        if (content.tileset && this.tilesetsToLoad.indexOf(content.tileset) === -1) {
          this.tilesetsToLoad.push(content.tileset);
        }
      }
    }
    this.mapService.updateLayers(layers, false);

  }

  async loadAssets(): Promise<void> {
    for (let id of this.tilesetsToLoad) {
      await this.tilesetService.loadTilesetImage(id);
    }
  }

  eraseLayer(): void {
    this.mapComp.eraseLayer();
  }

  layerSwitched(): void {
    this.mapComp.draw();
  }

  async save(): Promise<void> {
    console.log('SAVE');
    const map = this.mapService.getCurrent();
    const prevShowGrid = map.showGrid;

    const game = this.gameService.getCurrent();
    const character = this.characterService.getMain();
    const charset = this.charsetService.getCurrent();

    console.log('ON SAVE GAME', game);

    const mapSettings: MapSettings = {
      _id: map._id,
      title: map.title,
      width: map.width,
      height: map.height,
      tileSize: map.tileSize,
      showGrid: prevShowGrid,
      dataURL: '',
      mainCharacter: {
        i: character.i,
        j: character.j,
        charset: {
          id: charset.id,
          src: charset.src,
          spriteWidth: charset.spriteWidth,
          spriteHeight: charset.spriteHeight,
          directions: charset.directions,
          orientation: charset.orientation,
          hitbox: charset.hitbox
        }
      },
      layers: []
    }

    map.layers = [];
    this.mapService.hideGrid();
    for (let x = 0; x < this.grid.nbLayers; x++) {
      let tileData: any = {};
      for (let coor in this.grid.layers[x].tiles) {
        const tile = this.grid.layers[x].tiles[coor];
        if (tile.content) {
          tileData[coor] = tile.content;
        }
      };
      mapSettings.layers.push({tiles: tileData, dataURL: this.mapComp.getLayerDataURL(x)});
      map.layers.push(tileData);
    }
    if (prevShowGrid) this.mapService.showGrid()


    this.gameSettings = {
      _id: game._id,
      title: game.title,
      screenWidth: game.screenWidth,
      screenHeight: game.screenHeight,
      maps: [mapSettings]
    };

    if (!this.isDemo()) {

      console.log('MAP', map);
      map.preview = await this.mapComp.getPreviewDataURL();

      map.game = this.gameID;
      if (this.mapID === 'new') {
        this.mapService.create(map).subscribe((resp: APIResp) => {
          this.mapID = resp.data._id;
          this.mapService.updateID(this.mapID);
          this.router.navigate(['games', this.gameID, 'maps', this.mapID])
        });
      } else {
        this.mapService.update(map).subscribe();
      }

    }


  }


  async play(): Promise<void> {
    await this.save();
    const routes = this.isDemo() ? ['map-editor', 'play'] : ['games', this.gameID, 'maps', this.mapID, 'play'];
    this.router.navigate(routes, {state: {gameSettings: this.gameSettings}});
  }

  isDemo(): boolean {
    return window.location.href.includes('map-editor');
  }

}
