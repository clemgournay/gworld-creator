import { Directive, Input } from '@angular/core';

import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Directive()
export class ModalAbstractComponent {

  @Input('title') title: string = 'Info';

  opened: boolean = false;

  // Icons
  faTimes = faTimes;

  constructor() {

  }

  open(): void {
    this.opened = true;
    this.afterOpen();
  }

  afterOpen(): void {}

  close(): void {
    this.opened = false;
  }
}
