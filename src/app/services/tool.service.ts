import { Injectable } from '@angular/core';
import { faBrush, faEraser, faFile, faFillDrip, faSquare, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Tool } from '@models/tool';

@Injectable({
  providedIn: 'root',
})

export class ToolService {

  tools: Array<Tool> = [
    {id: 'brush', name: 'Brush', icon: faBrush},
    {id: 'bucket', name: 'Bucket', icon: faFillDrip},
    {id: 'eraser', name: 'Eraser', icon: faEraser},
    {id: 'blank', name: 'Blank', icon: faTimes}
  ];
  current: Tool;

  constructor() {
    this.current = this.tools[0];
  }

  getAll(): Array<Tool> {
    return this.tools;
  }

  getCurrent(): Tool {
    return this.current;
  }

  setCurrent(tool: Tool): void {
    this.current = tool;
  }

}
