import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { faTableCells } from '@fortawesome/free-solid-svg-icons';

import { APIResp } from '@models/api-resp';
import { Game } from '@models/game';
import { Map } from '@models/map';

import { AppService } from '@services/app.service';
import { GameService } from '@services/game.service';
import { MapService } from '@services/map.service';
import { SharedModule } from '@shared/shared.module';

import { HeaderComponent } from '@components/parts/header/header.component';


@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [
    SharedModule,
    HeaderComponent,
  ],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.scss'
})
export class GameDetailComponent {

  title: string = '';
  initStateSub: Subscription;
  game: Game;

  maps: Array<Map> = [];

  // Icons
  faTableCells = faTableCells;

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private gameService: GameService,
    private mapService: MapService
  ) {

  }

  ngOnInit(): void {
    this.initStateSub = this.appService.getInitState().subscribe((state: boolean) => {
      if (state) this.loadingComplete();
    });
  }

  loadingComplete(): void {
    const gameID = this.route.snapshot.paramMap.get('game-id');
    if (gameID) {
      this.gameService.getOne(gameID).subscribe((resp: APIResp) => {
        this.game = resp.data;
        this.title = this.game.title;
        this.gameService.setCurrent(this.game);
      });
    }

  }


}
