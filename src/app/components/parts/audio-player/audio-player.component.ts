import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Audio } from '@models/audio';
import { AudioService } from '@services/audio.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss'
})
export class AudioPlayerComponent {
  
  @Input('audio') audio: Audio;

  @ViewChild('player') playerEl: ElementRef;
  @ViewChild('visualizer') visualizerEl: ElementRef;
  visualizer: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  width: number = 0;
  height: number = 0;

  src: string = '';
  
  audioCtx: AudioContext;

  constructor(
    private audioService: AudioService
  ) {
    this.audioCtx = new AudioContext();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['audio']) {
      this.audioService.getBuffer(this.audio).subscribe((arrayBuffer: ArrayBuffer) => {
        console.log('BUFFER', arrayBuffer);
        this.audioCtx.decodeAudioData(arrayBuffer, (buffer) => {
          /*buffer = buffer;
          this.audioCtx
          src = auctx.createBufferSource();
          src.buffer = buffer;
          src.loop = false;
          src.connect(auctx.destination);
          src.start(0);
          analyser = auctx.createAnalyser();
          src.connect(analyser);
          analyser.connect(auctx.destination);
          analyser.fftSize = 256;
          buffLen = analyser.frequencyBinCount;
          dataArray = new Uint8Array(buffLen);
          barWidth = (500 - 2 * buffLen - 4) / buffLen * 2.5;
          ctx.lineWidth = barWidth;
          draw();*/
        });
      });
      /*const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.connect(distortion);
      distortion.connect(audioCtx.destination);*/
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.visualizer = this.visualizerEl.nativeElement;
      this.width = this.playerEl.nativeElement.offsetWidth;
      this.height = this.playerEl.nativeElement.offsetHeight;
      console.log(this.visualizerEl);
      this.visualizer.width = this.width;
      this.visualizer.height = this.height;
      this.visualizer.style.width = this.width + 'px';
      this.visualizer.style.height = this.height + 'px';
      this.ctx = this.visualizer.getContext('2d') as CanvasRenderingContext2D;
    })

  }

  
}
