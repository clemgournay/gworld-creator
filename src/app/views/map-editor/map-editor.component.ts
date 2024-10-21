import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

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

@Component({
  standalone: true,
  imports: [
    SharedModule,
    HeaderComponent,
    toolbarComponent,
    MapComponent,
    MapbarComponent
  ],
  templateUrl: './map-editor.component.html',
  styleUrl: './map-editor.component.scss'
})
export class MapEditorComponent {

  grid: Grid;
  mapChanged: Subject<Map>;
  gameSettings: GameSettings;

  @ViewChild('mapComp') mapComp: MapComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private mapService: MapService,
    private charsetService: CharsetService,
    private characterService: CharacterService
  ) {
    this.mapChanged = this.mapService.getChanges();

    const state = history.state;

    if (state.gameSettings) {
      const gameSettings = state.gameSettings;
      const mapSettings = gameSettings.maps[0];
      this.mapService.updateWidth(mapSettings.width, false);
      this.mapService.updateHeight(mapSettings.height, false);
      this.mapService.updateTileSize(mapSettings.tileSize, false);
      this.mapService.updateTitle(mapSettings.title);
      if (!mapSettings.showGrid) this.mapService.hideGrid();

      this.grid = new Grid(mapSettings.width, mapSettings.height, mapSettings.tileSize);
      for (let x = 0; x < mapSettings.layers.length; x++) {
        const tiles = mapSettings.layers[x].tiles;
        for (let coor in tiles) {
          const content = tiles[coor];
          const coordinates = ParseCoordinates(coor);
          this.grid.updateTileContentInLayer(x, coordinates.i, coordinates.j, content);
        }
      }
    } else {
      const map = this.mapService.getCurrent();
      this.grid = new Grid(map.width, map.height, map.tileSize)
    }

    this.mapChanged.subscribe((newMap: Map) => {
      this.grid.updateSize(newMap.width, newMap.height, newMap.tileSize);
    });
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
    if (prevShowGrid) this.mapService.showGrid();


    this.gameSettings = {
      _id: game._id,
      title: game.title,
      screenWidth: game.screenWidth,
      screenHeight: game.screenHeight,
      maps: [mapSettings]
    };

    if (!this.isDemo()) {

      console.log('MAP', map);

      if (map._id === 'new') {
        this.mapService.create(map).subscribe((resp: APIResp) => {
          const newID = resp.data._id;
          /*this.mapService.updateID(newID);
          this.router.navigate([],  {
              relativeTo: this.route,
              arams: {'map-id': newID},
              queryParamsHandling: 'merge'
          });*/
          //window.location.href = window.location.href.replace('new', newID);
        });
      }

    }

  }


  async play(): Promise<void> {
    await this.save();
    const routes = this.isDemo() ? ['map-editor', 'play'] : ['games', 'new', 'maps', 'new', 'play'];
    this.router.navigate(routes, {state: {gameSettings: this.gameSettings}});
  }

  isDemo(): boolean {
    return window.location.href.includes('map-editor');
  }

}
