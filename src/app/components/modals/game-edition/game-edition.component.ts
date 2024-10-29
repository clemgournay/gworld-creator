import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalAbstractComponent } from '@components/abstract/modal.abstract';
import { faFolderPlus, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { APIResp } from '@models/api-resp';
import { Game } from '@models/game';
import { GameService } from '@services/game.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'modal-game-edition',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './game-edition.component.html',
  styleUrl: './game-edition.component.scss'
})
export class GameEditionModalComponent extends ModalAbstractComponent {

  editionForm: FormGroup;

  @Output('created') created = new EventEmitter<Game>();

  // Icons
  faFolderPlus = faFolderPlus;

  constructor(private gameService: GameService) {
    super();
    this.title = 'Game creation';
    this.headerIcon = faGamepad;

    this.editionForm = new FormGroup({
      title: new FormControl('New game', [Validators.required]),
      screenWidth: new FormControl(1000),
      screenHeight: new FormControl(1000)
    })
  }

  create(): void {
    const game = this.editionForm.value as Game;
    this.gameService.create(game).subscribe((resp: APIResp) => {
      if (resp.data) {
        this.created.emit(resp.data);
        this.close();
      } else {
        alert('An error occured');
      }
    });
  }

}
