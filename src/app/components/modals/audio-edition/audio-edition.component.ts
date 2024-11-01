import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalAbstractComponent } from '@components/abstract/modal.abstract';
import { AUDIO_EXTENSIONS } from '@data/files';
import { faMusic, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { APIResp } from '@models/api-resp';
import { Audio } from '@models/audio';
import { Tab } from '@models/tab';
import { AudioService } from '@services/audio.service';
import { SharedModule } from '@shared/shared.module';
import { environment } from '../../../../environments/environment';
import { AudioPlayerComponent } from "../../parts/audio-player/audio-player.component";

@Component({
  selector: 'modal-audio-edition',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AudioPlayerComponent
  ],
  templateUrl: './audio-edition.component.html',
  styleUrl: './audio-edition.component.scss'
})
export class AudioEditionComponent extends ModalAbstractComponent {

  tabs: Array<Tab> = [
    {key: 'bgm', label: 'Background Music', icon: faMusic},
    {key: 'sfx', label: 'Sound Effects', icon: faVolumeHigh},
  ];
  currentTab: Tab;
  audios: Array<Audio> = [];

  // const
  AUDIO_EXTENSIONS = AUDIO_EXTENSIONS;

  // Icons

  constructor(
    private audioService: AudioService
  ) {
    super();
    this.title = 'Music edition';
    this.headerIcon = faMusic;
    this.currentTab = this.tabs[0];
  }

  override afterOpen(): void {
    this.audioService.getAll().subscribe((resp: APIResp) => {
      console.log(resp.data);
      this.audios = resp.data;
    });
  }

  getAudios(): Array<Audio> {
    const audios = this.getAudiosByType(this.currentTab.key);
    return audios;
  }

  getAudiosByType(type: string): Array<Audio> {
    return this.audios.filter((audio: Audio) => {
      return audio.type === type
    });
  }

  switchTab(tab: Tab): void {
    this.currentTab = tab;
  }

  fileSelected(e: Event): void {
    const inputEl = e.target as HTMLInputElement;
    const files = inputEl.files as FileList;
    if (files.length > 0) {
      const file = files[0];
      console.log(file);
      this.audioService.upload(file).subscribe((resp: APIResp) => {
        const media = resp.data;
        const audio: Audio = {
          _id: 'new',
          title: media.originalname,
          type: this.currentTab.key,
          mimeType: media.mimeType,
          src: `${environment.apiURL}/media/${media.filename}`
        }
        this.audioService.create(audio).subscribe((resp: APIResp) => {
          console.log(resp.data);
          this.audios.push(resp.data);
        });
      });
    }
  }
}
