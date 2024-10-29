import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tileset } from '@models/tileset';
import { FindItemByPropValue } from '@utils/array';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root',
})

export class TilesetService {

  baseURL: string = `${environment.apiURL}/tilesets`;
  tilesets: Array<Tileset> = [];
  current: Tileset;

  changes: Subject<Tileset>;

  constructor(private http: HttpClient) {
    this.changes = new Subject();
    this.current = {
      _id: '',
      title: '',
      src: '',
      width: 0, height: 0,
      tileSize: 0,
      screenWidth: 0, screenHeight: 0,
      img: new Image()
    }
  }

  async loadTilesetImage(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const tileset = FindItemByPropValue(this.tilesets, '_id', id);
      if (!tileset.img) {
        tileset.img = new Image();
        tileset.img.crossOrigin = 'anonymous';
      }
      tileset.img.src = tileset.src;
      tileset.img.onload = () => {
        tileset.screenWidth = tileset.img.width;
        tileset.screenHeight = tileset.img.height;
        tileset.width = Math.floor(tileset.img.width / tileset.tileSize);
        tileset.height = Math.floor(tileset.img.height / tileset.tileSize);
        resolve();
      }
    });
  }

  retrieveAll(): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('tileset', file);
    return this.http.post<Observable<any>>(`${this.baseURL}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    }).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  create(tileset: Tileset): Observable<any> {
    const data: any = tileset;
    delete data._id;
    delete data.img;
    return this.http.post<Observable<any>>(`${this.baseURL}`, data).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  async add(tileset: Tileset): Promise<void> {
    this.tilesets.push(tileset);
    this.current = this.tilesets[this.tilesets.length - 1];
    await this.loadTilesetImage(this.current._id);
    this.changes.next(this.current);
  }

  getAll(): Array<Tileset> {
    return this.tilesets;
  }

  async setAll(tilesets: Array<Tileset>): Promise<void> {
    this.tilesets = tilesets;
    if (this.tilesets.length > 0) {
      this.current = this.tilesets[0];
      await this.loadTilesetImage(this.current._id);
      this.changes.next(this.current);
    }
  }

  getCurrent(): Tileset {
    return this.current;
  }

  getChanges(): Subject<Tileset> {
    return this.changes;
  }

  getByID(id: string): Tileset | null {
    return FindItemByPropValue(this.tilesets, '_id', id);
  }

  setCurrentByID(id: string): void {
    const tileset = FindItemByPropValue(this.tilesets, '_id', id);
    if (tileset) this.current = tileset;
    this.loadTilesetImage(this.current._id);
    this.changes.next(this.current);
  }

  toggleCollider(i: number, j: number): void {
    const coor = `${i}-${j}`;
    if (!this.current.colliders) this.current.colliders = [];
    let index = this.current.colliders.indexOf(coor);
    if (index === -1) this.current.colliders.push(coor);
    else this.current.colliders.splice(index, 1);
  }
}
