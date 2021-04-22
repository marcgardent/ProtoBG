import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/app/core/contracts';
import { gameIcons } from '../../lib/gameicons/gameicons';

@Component({
  selector: 'app-glyphs-viewer',
  templateUrl: './glyphs-viewer.component.html',
  styleUrls: ['./glyphs-viewer.component.sass']
})
export class GlyphsViewerComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent  {

  constructor() {
    super();
  }

  link(header: any) {
    
  }

  ngOnInit(): void {
  }

}
