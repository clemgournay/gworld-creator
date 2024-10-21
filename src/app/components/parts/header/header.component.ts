import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCircleStop, faFloppyDisk, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Map } from '@models/map';
import { AppService } from '@services/app.service';
import { MapService } from '@services/map.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input('view') view: string = 'home';
  @Input('title') title: string = '';

  mapTitle: string = '';

  @Output('requestSave') requestSave = new EventEmitter<void>();
  @Output('requestPlay') requestPlay = new EventEmitter<void>();
  @Output('requestStop') requestStop = new EventEmitter<void>();

  // Icons
  faFloppyDisk = faFloppyDisk;
  faPlay = faPlay;
  faCircleStop = faCircleStop;

  constructor(
    private appService: AppService,
    private mapService: MapService
  ) {
    const map = this.mapService.getCurrent();
    this.mapTitle = map.title;
  }

  getMap(): Map {
    return this.mapService.getCurrent();
  }

  save(): void {
    this.requestSave.emit();
  }

  play(): void {
    this.requestPlay.emit();
  }

  stop(): void {
    this.requestStop.emit();
  }

  isDemo(): boolean {
    return window.location.href.includes('map-editor');
  }

  isPlaying(): boolean {
    return window.location.href.includes('play');
  }

  updateMapTitle(): void {
    this.mapService.updateTitle(this.mapTitle);
  }

}
