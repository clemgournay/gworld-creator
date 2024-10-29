import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faGamepad, faPen, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

import { GameEditionModalComponent } from '@components/modals/game-edition/game-edition.component';
import { HeaderComponent } from '@components/parts/header/header.component';
import { APIResp } from '@models/api-resp';
import { Game } from '@models/game';

import { AppService } from '@services/app.service';
import { GameService } from '@services/game.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [
    SharedModule,
    HeaderComponent,
    GameEditionModalComponent
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
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;

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


  remove(game: Game, index: number): void {
    this.gameService.delete(game._id).subscribe();
    this.games.splice(index, 1);
  }

}
