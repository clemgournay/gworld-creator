import { Component, Input, ViewChild } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { Game } from '@classes/game';

import { GameSettings } from '@models/game-settings';

@Component({
  selector: 'app-game-view',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './game-view.component.html',
  styleUrl: './game-view.component.scss'
})
export class GameViewComponent {

  @Input('settings') settings: GameSettings;

  game: Game;

  constructor() {
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.game = new Game(this.settings);
      console.log('[GAME]', this.game);
      this.game.run();
    });

  }

}
