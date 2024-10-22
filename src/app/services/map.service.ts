import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Map } from '@models/map';

@Injectable({
  providedIn: 'root',
})

export class MapService {

  baseURL: string = `${environment.apiURL}/maps`;
  maps: Array<Map> = [];
  current: Map;

  changes: Subject<Map>;

  constructor(private http: HttpClient) {
    this.changes = new Subject();
    this.current = {
      _id: 'new',
      title: 'New map',
      width: 26,
      height: 20,
      screenWidth: 26*32,
      screenHeight: 20*32,
      tileSize: 32,
      showGrid: true,
      layers: []
    };

    this.changes.next(this.current);
  }

  getAll(): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  getOne(mapID: string): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}/${mapID}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  getLayers(mapID: string): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}/${mapID}/layers`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  create(map: Map): Observable<any> {
    return this.http.post<Observable<any>>(`${this.baseURL}`, map).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  update(map: Map): Observable<any> {
    return this.http.put<Observable<any>>(`${this.baseURL}/${map._id}`, map).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  getGameMaps(gameID: string): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}/?game=${gameID}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  getCurrent(): Map {
    return this.current;
  }

  getChanges(): Subject<Map> {
    return this.changes;
  }

  updateID(id: string): void {
    this.current._id = id;
  }

  updateTitle(title: string): void {
    this.current.title = title;
  }

  updateWidth(width: number, propagation: boolean = true): void {
    this.current.width = width;
    this.current.screenWidth = width * this.current.tileSize;
    if (propagation) this.changes.next(this.current);
  }
  updateHeight(height: number, propagation: boolean = true): void {
    this.current.height = height;
    this.current.screenHeight = height * this.current.tileSize;
    if (propagation) this.changes.next(this.current);
  }

  updateTileSize(tileSize: number, propagation: boolean = true): void {
    this.current.tileSize = tileSize;
    if (propagation) this.changes.next(this.current);
  }

  showGrid(): void {
    this.current.showGrid = true;
    this.changes.next(this.current);
  }

  hideGrid(): void {
    this.current.showGrid = false;
    this.changes.next(this.current);
  }

}
