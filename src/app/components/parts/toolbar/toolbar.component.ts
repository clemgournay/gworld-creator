import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { faPenToSquare, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { Subject, Subscription } from 'rxjs';

import { SharedModule } from '@shared/shared.module';

import { Area } from '@models/area';
import { Coordinate } from '@models/coordinate';
import { Tileset } from '@models/tileset';
import { Tool } from '@models/tool';
import { Charset } from '@models/charset';


import { SelectionService } from '@services/selection.service';
import { TilesetService } from '@services/tileset.service';
import { ToolService } from '@services/tool.service';
import { CharsetService } from '@services/charset.service';

import { TilesetEditiontModalComponent } from '@components/modals/tileset-edition/tileset-edition.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    SharedModule,
    TilesetEditiontModalComponent
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class toolbarComponent {

  tilesetChanged: Subject<Tileset>;
  @ViewChild('gridEl') gridEl: ElementRef;

  ctx: CanvasRenderingContext2D;

  cursorArea: Area;

  hovering: boolean = false;
  selecting: boolean = false;
  selectionStartPos: Coordinate;

  selectedTilesetID: string;

  @ViewChild('tilesetEditionModal') tilesetEditionModal: TilesetEditiontModalComponent;

  @Output('requestEraseLayer') requestEraseLayer = new EventEmitter<void>();

  // Icons
  faSquarePlus = faSquarePlus;
  faPenToSquare = faPenToSquare;

  constructor(
    private toolService: ToolService,
    private tilesetService: TilesetService,
    private charsetService: CharsetService,
    private selectionService: SelectionService
  ) {
    this.tilesetChanged = this.tilesetService.getChanges();

    this.cursorArea = {
      i: 0,
      j: 0,
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      screenWidth: 0,
      screenHeight: 0
    };

    this.tilesetChanged.subscribe((newTileset: Tileset) => {
      this.selectedTilesetID = newTileset._id;
      console.log('NEW TILESET', newTileset)
      this.cursorArea = {
        i: 0,
        j: 0,
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        screenWidth: newTileset.tileSize,
        screenHeight: newTileset.tileSize
      }
    });
  }

  getSelectionArea(): Area {
    return this.selectionService.getArea();
  }

  getCurrentTileset(): Tileset {
    return this.tilesetService.getCurrent();
  }

  getTilesets(): Array<Tileset> {
    return this.tilesetService.getAll();
  }

  onTilesetEnter(): void {
    if (!this.isSmallSize()) this.hovering = true;
  }

  onTilesetLeave(): void {
    if (!this.isSmallSize()) this.hovering = false;
  }

  onMouseDown(e: MouseEvent): void {
    this.selectionService.updatePosition(this.cursorArea.i, this.cursorArea.j);
    this.selectionService.updateSize(1, 1);
    this.selectionStartPos = {i: this.cursorArea.i, j: this.cursorArea.j};
    this.selecting = true;
  }

  onMouseMove(e: MouseEvent): void {
    const tileset = this.tilesetService.getCurrent();

    const rect = this.gridEl.nativeElement.getBoundingClientRect();
    const left = e.pageX -  rect.left;
    const top = e.pageY - rect.top;

    const newLeft = Math.floor(left / tileset.tileSize);
    const newTop = Math.floor(top / tileset.tileSize);

    this.cursorArea.i = newLeft;
    this.cursorArea.j = newTop;
    this.cursorArea.x = newLeft * tileset.tileSize;
    this.cursorArea.y = newTop * tileset.tileSize;

    if (this.selecting) {
      const width = (this.cursorArea.i - this.selectionStartPos.i) + 1;
      const height = (this.cursorArea.j - this.selectionStartPos.j) + 1;
      this.selectionService.updateSize(width, height);
    }
  }

  onMouseUp(e: MouseEvent): void {
    this.selecting = false;
  }

  onMouseLeave(e: MouseEvent): void {
    this.selecting = false;
  }

  getTools(): Array<Tool> {
    return this.toolService.getAll();
  }

  getCurrentTool(): Tool {
    return this.toolService.getCurrent();
  }

  updateTool(tool: Tool) {
    if (tool.id === 'blank') this.requestEraseLayer.emit();
    else this.toolService.setCurrent(tool);
  }

  updateTileset(): void {
    this.tilesetService.setCurrentByID(this.selectedTilesetID);
  }

  getCurrentCharset(): Charset {
    return this.charsetService.getCurrent();
  }

  getCharsets(): Array<Charset> {
    return this.charsetService.getAll();
  }

  updateCharset(charset: Charset): void {
    this.charsetService.setCurrent(charset);
  }

  isSmallSize(): boolean {
    return window.innerHeight <= 900;
  }

  openTilesetCreation(): void {
    this.tilesetEditionModal.switchView('creation');
    this.tilesetEditionModal.open();
  }

  openTilesetEdition(): void {
    this.tilesetEditionModal.switchView('edition');
    this.tilesetEditionModal.open();
  }
}
