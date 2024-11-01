import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Audio } from '@models/audio';

@Injectable({
  providedIn: 'root',
})

export class AudioService {

  baseURL: string = `${environment.apiURL}/audios`;

  constructor(private http: HttpClient) {

  }

  getAll(): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  create(audio: Audio): Observable<any> {
    const data: any = audio;
    delete data._id;
    return this.http.post<Observable<any>>(`${this.baseURL}`, data).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('audio', file);
    return this.http.post<Observable<any>>(`${this.baseURL}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    }).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  getBuffer(audio: Audio): Observable<any> {
    return this.http.get(audio.src, {responseType: 'arraybuffer'}).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

}
