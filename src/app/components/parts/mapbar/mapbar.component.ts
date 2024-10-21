import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import { SharedModule } from '@shared/shared.module';

import { MapService } from '@services/map.service';

import { Grid } from '@classes/grid';
import { Layer } from '@classes/layer';


@Component({
  selector: 'app-mapbar',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './mapbar.component.html',
  styleUrl: './mapbar.component.scss'
})
export class MapbarComponent {

  @Input('grid') grid: Grid;

  @Output('switchedLayer') switchedLayer = new EventEmitter<void>();

  mapWidth: number;
  mapHeight: number;
  tileSize: number;
  showGrid: boolean;

  // Icons
  faLayerGroup = faLayerGroup;

  constructor(
    private mapService: MapService
  ) {
    const map = this.mapService.getCurrent();
    this.mapWidth = map.width;
    this.mapHeight = map.height;
    this.tileSize = map.tileSize;
    this.showGrid = map.showGrid;
  }


  toggleGrid(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.checked) {
      this.mapService.showGrid();
    } else {
      this.mapService.hideGrid();
    }
  }

  getLayers(): Array<Layer> {
    return this.grid.getLayers();
  }

  getCurrentLayer(): Layer {
    return this.grid.getCurrentLayer();
  }

  switchLayer(layer: Layer): void {
    this.grid.switchLayer(layer);
    this.switchedLayer.emit();
  }

  updateWidth(): void {
    this.mapService.updateWidth(this.mapWidth);
  }

  updateHeight(): void {
    this.mapService.updateHeight(this.mapHeight);
  }

  updateTileSize(): void {
    this.mapService.updateTileSize(this.tileSize);
  }

}
