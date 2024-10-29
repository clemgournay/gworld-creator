import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Game } from '@models/game';

@Injectable({
  providedIn: 'root',
})

export class GameService {

  baseURL: string = `${environment.apiURL}/games`;

  games: Array<Game> = [{
    _id: 'new',
    title: 'Game',
    screenWidth: 26*32,
    screenHeight: 20*32
  }];
  current: Game;

  constructor(private http: HttpClient) {
    this.current = this.games[0];
  }

  getAll(): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  getMines(): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}/mines`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  getOne(id: string): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}/${id}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  create(game: Game): Observable<any> {
    const data: any = game;
    delete data._id;
    return this.http.post<Observable<any>>(`${this.baseURL}`, data).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  delete(id: string): Observable<any> {
    return this.http.delete<Observable<any>>(`${this.baseURL}/${id}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  getCurrent(): Game {
    return this.current;
  }

  setCurrent(game: Game) {
    this.current = game;
  }

  updateID(id: string): void {
    this.current._id = id;
  }

}
