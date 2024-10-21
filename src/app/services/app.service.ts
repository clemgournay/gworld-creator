import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class AppService {

  private initState = new BehaviorSubject<any>(false);

  constructor() {

  }

  initComplete(): void {
    this.initState.next(true);
  }

  getInitState(): Observable<any> {
    return this.initState.asObservable();
  }

}
