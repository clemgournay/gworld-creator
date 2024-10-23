import { Component, Input } from '@angular/core';
import { Grid } from '@classes/grid';
import { ModalAbstractComponent } from '@components/abstract/modal.abstract';
import { faCircle, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Tileset } from '@models/tileset';
import { TilesetService } from '@services/tileset.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'modal-tileset-edition',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './tileset-edition.component.html',
  styleUrl: './tileset-edition.component.scss'
})
export class TilesetEditiontModalComponent extends ModalAbstractComponent {

  grid: Grid;

  // Icons
  faPenToSquare = faPenToSquare;
  faCircle = faCircle;

  constructor(private tilesetService: TilesetService) {
    super();
    this.title = 'Tileset edition';
  }

  getTileset(): Tileset {
    return this.tilesetService.getCurrent();
  }

  override afterOpen(): void {
    const tileset = this.getTileset();
    this.grid = new Grid(tileset.width, tileset.height, tileset.tileSize, 1);
    console.log('TILESET', tileset);
    for (let i = 0; i <= tileset.width; i++) {
      for (let j = 0; j <= tileset.height; j++) {
        const coor = `${i}-${j}`;
        if (tileset.colliders && tileset.colliders.indexOf(coor) >= 0) {
          this.grid.updateTileContent(i, j, {tileset: tileset.id, i, j, collider: true});
        }
      }
    }
    console.log('GRID', this.grid);

  }
}
