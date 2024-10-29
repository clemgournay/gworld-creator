import { Component, Input } from '@angular/core';
import { Grid } from '@classes/grid';
import { Tile } from '@classes/tile';
import { ModalAbstractComponent } from '@components/abstract/modal.abstract';
import { faCircle, faFloppyDisk, faPenToSquare, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { APIResp } from '@models/api-resp';
import { Tileset } from '@models/tileset';
import { TilesetService } from '@services/tileset.service';
import { SharedModule } from '@shared/shared.module';
import { environment } from '../../../../environments/environment';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IMAGE_EXTENSIONS } from '@data/files';

@Component({
  selector: 'modal-tileset-edition',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  templateUrl: './tileset-edition.component.html',
  styleUrl: './tileset-edition.component.scss'
})
export class TilesetEditiontModalComponent extends ModalAbstractComponent {

  grid: Grid;
  view: string = 'creation';
  tilesetID: string = 'new';

  editionForm: FormGroup;

  img: HTMLImageElement;

  // const
  IMAGE_EXTENSIONS = IMAGE_EXTENSIONS;

  // Icons
  faPenToSquare = faPenToSquare;
  faCircle = faCircle;
  faFloppyDisk = faFloppyDisk;

  constructor(private tilesetService: TilesetService) {
    super();
    this.title = 'Tileset creation';
    this.headerIcon = faTableCells;

    this.editionForm = new FormGroup({
      title: new FormControl(''),
      src: new FormControl(''),
      width: new FormControl(0),
      height: new FormControl(0),
      screenWidth: new FormControl(0),
      screenHeight: new FormControl(0),
      tileSize: new FormControl(32),
      colliders: new FormArray([])
    });

    this.editionForm.get('tileSize')?.valueChanges.subscribe(newSize => {
      this.updateGrid();
    });
  }

  override afterOpen(): void {
    switch(this.view) {
      case 'creation':
        this.tilesetID = 'new';
      break;
      case 'edition':
        this.editionForm.reset();
        const tileset = this.tilesetService.getCurrent();
        this.tilesetID = tileset._id;
        this.editionForm.get('title')?.setValue(tileset.title);
        this.editionForm.get('src')?.setValue(tileset.src);
        this.editionForm.get('width')?.setValue(tileset.width);
        this.editionForm.get('height')?.setValue(tileset.height);
        this.editionForm.get('screenWidth')?.setValue(tileset.screenWidth);
        this.editionForm.get('screenHeight')?.setValue(tileset.screenHeight);
        this.editionForm.get('tileSize')?.setValue(tileset.tileSize);
        this.img = tileset.img;
      break;
    }
  }

  switchView(view: string): void {
    this.view = view;

    switch (this.view) {
      case 'creation':
        this.title = 'Tileset creation';
        this.headerIcon = faTableCells;
      break;

      case 'edition':
        this.title = 'Tileset edition';
        this.headerIcon = faPenToSquare;
        this.buildTilesetGrid();
      break;
    }
  }

  buildTilesetGrid(): void {
    let width = this.editionForm.get('width')?.value ;
    let height = this.editionForm.get('height')?.value ;
    let tileSize = this.editionForm.get('tileSize')?.value;
    let colliders  = this.editionForm.get('colliders')?.value;

    console.log('VALUE', this.editionForm.value)
    console.log('TILESIZE', tileSize);
    this.grid = new Grid(width, height, tileSize, 1);
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const coor = `${i}-${j}`;
        if (colliders.indexOf(coor) >= 0) {
          this.grid.updateTileContent(i, j, {tileset: this.tilesetID, i, j, collider: true});
        } else {
          this.grid.updateTileContent(i, j, {tileset: this.tilesetID, i, j, collider: false});
        }
      }
    }
    console.log(this.grid.height, this.grid.tileSize);
  }

  fileSelected(e: Event): void {
    const inputEl = e.target as HTMLInputElement;
    const files: FileList | null = inputEl.files;
    if (files && files.length > 0) {
      const firstFile = files[0];
      console.log(firstFile);
      let name = firstFile.name.replace(/[@#\$%\^\&*\)\(+=\'\"]+$/g, '');
      for (let ext of IMAGE_EXTENSIONS) name = name.replace('.' + ext, '');
      name = name.replace(' ', '-');

      this.editionForm.get('title')?.setValue(name);
      this.tilesetService.upload(firstFile).subscribe((resp: APIResp) => {
        console.log('DATA', resp.data);
        const media = resp.data;
        const src = `${environment.apiURL}/media/${media.filename}`;
        this.editionForm.get('src')?.setValue(src);
        this.img = new Image();
        this.img.src = src;

        this.img.onload = () => {
          this.updateValues();
          this.switchView('edition');
        }
      });
    }
  }

  toggleCollider(tile: Tile): void {
    if (tile.content) tile.content.collider = !tile.content.collider;
    const colliders = this.editionForm.get('colliders') as FormArray;
    let coor = `${tile.i}-${tile.j}`
    const index = colliders.controls.findIndex(control => control.value === coor);
    if (index === -1) colliders.push(new FormControl(coor));
    else colliders.removeAt(index);
  }

  updateValues(): void {
    let tileSize = this.editionForm.get('tileSize')?.value;
    console.log('TILESIZE UPDATE VALUE', tileSize);
    this.editionForm.get('screenWidth')?.setValue(this.img.width);
    this.editionForm.get('screenHeight')?.setValue(this.img.height);
    this.editionForm.get('width')?.setValue(Math.floor(this.img.width / tileSize));
    this.editionForm.get('height')?.setValue(Math.floor(this.img.height / tileSize));
  }

  updateGrid(): void {
    if (this.grid) {
      let width = this.editionForm.get('width')?.value;
      let height = this.editionForm.get('height')?.value;
      let tileSize = this.editionForm.get('tileSize')?.value;
      this.grid.updateSize(width, height, tileSize);
    }
  }

  save(): void {
    if (this.tilesetID === 'new') {
      const data = this.editionForm.value;
      this.tilesetService.create(data).subscribe((resp: APIResp) => {
        const newTileset = resp.data;
        this.tilesetService.add(newTileset);
        this.close();
      });
    }

  }
}
