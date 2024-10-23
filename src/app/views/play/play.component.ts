import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { GameSettings } from '@models/game-settings';
import { MapService } from '@services/map.service';

import { GameViewComponent } from '@components/parts/game-view/game-view.component';
import { HeaderComponent } from '@components/parts/header/header.component';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [
    SharedModule,
    HeaderComponent,
    GameViewComponent
  ],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent {

  gameSettings: GameSettings;
  constructor(
    private router: Router,
    private mapService: MapService
  ) {

  }

  ngOnInit(): void {
    const state = history.state;
    if (state.gameSettings) {
      this.gameSettings = state.gameSettings;
      const mapSettings = this.gameSettings.maps[0];
      this.mapService.updateTitle(mapSettings.title);
    } else {
      const isDemo = window.location.href.includes('map-editor');
      const routes = isDemo ? ['map-editor'] : ['games', this.gameSettings._id, 'maps', this.gameSettings.maps[0]._id];
      console.log('NO GAME SETTINGS, come back');
      this.router.navigate(routes);
    }
  }


  stop(): void {
    const isDemo = window.location.href.includes('map-editor');
    const routes = isDemo ? ['map-editor'] : ['games', this.gameSettings._id, 'maps', this.gameSettings.maps[0]._id];
    this.router.navigate(routes, {state: {gameSettings: this.gameSettings}});
  }
}
