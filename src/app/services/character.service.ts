import { Injectable } from '@angular/core';
import { Character } from '@models/character';

import { Charset } from '@models/charset';
import { Subject } from 'rxjs';
import { CharsetService } from './charset.service';
import { MapService } from './map.service';
import { MainCharacter } from '@classes/main-character';

@Injectable({
  providedIn: 'root',
})

export class CharacterService {

  characters: Array<Character> = [];
  mainCharacter: Character;

  charsetChanged: Subject<Charset>;

  constructor(
    private charsetService: CharsetService,
    private mapService: MapService
  ) {
    const map = this.mapService.getCurrent();
    this.charsetChanged = this.charsetService.getChanges();
    const charset = this.charsetService.getCurrent();
    this.characters = [{
      id: 'main',
      i: 3,
      j: 3,
      x: 0,
      y: 0,
      charset
    }];
    this.mainCharacter = this.characters[0];
    this.mainCharacter.x = this.mainCharacter.i * map.tileSize;
    this.mainCharacter.y = this.mainCharacter.j * map.tileSize;
    this.charsetChanged.subscribe((newCharset: Charset) => {
      this.mainCharacter.charset = newCharset;
    });
  }

  getAll(): Array<Character> {
    return this.characters;
  }

  getMain(): Character {
    return this.mainCharacter;
  }

}
