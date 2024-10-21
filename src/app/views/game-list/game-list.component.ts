import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameCreationModalComponent } from '@components/modals/game-creation/game-creation.component';
import { HeaderComponent } from '@components/parts/header/header.component';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { APIResp } from '@models/api-resp';
import { Game } from '@models/game';
import { AppService } from '@services/app.service';
import { GameService } from '@services/game.service';
import { SharedModule } from '@shared/shared.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [
    SharedModule,
    HeaderComponent,
    GameCreationModalComponent
  ],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent {

  title: string = 'My games';
  initStateSub: Subscription;

  games: Array<Game> = [];

  // Icons
  faGamepad = faGamepad;

  constructor(
    private appService: AppService,
    private gameService: GameService,
    private router: Router
  ) {
    this.initStateSub = this.appService.getInitState().subscribe((state: boolean) => {
      if (state) this.loadingComplete();
    })
  }

  loadingComplete(): void {
    this.gameService.getMines().subscribe((resp: APIResp) => {
      this.games = resp.data;
    });
  }

  newGame(game: Game): void {
    this.games.push(game);
  }

}
