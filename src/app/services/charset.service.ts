import { Injectable } from '@angular/core';
import { CHARSETS } from '@data/charsets';

import { Charset } from '@models/charset';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CharsetService {

  charsets: Array<Charset> = CHARSETS;
  current: Charset;
  changes: Subject<Charset>;


  constructor() {
    this.current = this.charsets[0];
    this.changes = new Subject();
    this.processImage();
  }


  processImage(): void {
    this.current.img.src = this.current.src;
    this.current.img.onload = () => {
      this.current.screenWidth = this.current.img.width;
      this.current.screenHeight = this.current.img.height;
      this.changes.next(this.current);
    }
  }

  getChanges(): Subject<Charset> {
    return this.changes;
  }

  getAll(): Array<Charset> {
    return this.charsets;
  }

  getCurrent(): Charset {
    return this.current;
  }

  setCurrent(charset: Charset): void {
    this.current = charset;
    this.processImage();
  }

}
