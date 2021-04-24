import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/frontend/app/layout/contracts';
import { gameIcons } from 'src/core/gameicons/gameicons';

@Component({
  selector: 'app-glyphs-viewer',
  templateUrl: './glyphs-viewer.component.html',
  styleUrls: ['./glyphs-viewer.component.sass']
})
export class GlyphsViewerComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent  {
  gameIcons = gameIcons;

  constructor() {
    super();
  }

  link(header: any) {
    
  }

  ngOnInit(): void {
  }

}
