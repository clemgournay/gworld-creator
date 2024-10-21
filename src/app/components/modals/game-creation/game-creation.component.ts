import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalAbstractComponent } from '@components/abstract/modal.abstract';
import { faFolderPlus, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { APIResp } from '@models/api-resp';
import { Game } from '@models/game';
import { GameService } from '@services/game.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'modal-game-creation',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './game-creation.component.html',
  styleUrl: './game-creation.component.scss'
})
export class GameCreationModalComponent extends ModalAbstractComponent {

  creationForm: FormGroup;

  @Output('created') created = new EventEmitter<Game>();

  // Icons
  faGamepad = faGamepad;
  faFolderPlus = faFolderPlus;

  constructor(private gameService: GameService) {
    super();
    this.title = 'Game creation';

    this.creationForm = new FormGroup({
      title: new FormControl('New game', [Validators.required]),
      screenWidth: new FormControl(1000),
      screenHeight: new FormControl(1000)
    })
  }

  create(): void {
    const game = this.creationForm.value as Game;
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
