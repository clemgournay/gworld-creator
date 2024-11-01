import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalAbstractComponent } from '@components/abstract/modal.abstract';
import { AUDIO_EXTENSIONS } from '@data/files';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'modal-music-edition',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './music-edition.component.html',
  styleUrl: './music-edition.component.scss'
})
export class MusicEditionComponent extends ModalAbstractComponent {

  musics: Array<any> = [];

  // const
  AUDIO_EXTENSIONS = AUDIO_EXTENSIONS;

  // Icons


  constructor(
  ) {
    super();
    this.title = 'Music edition';
    this.headerIcon = faMusic;
  }

  fileSelected(e: Event): void {
    const inputEl = e.target as HTMLInputElement;
    const files = inputEl.files as FileList;
    if (files.length > 0) {
      const file = files[0];
      
    }
  }
}
