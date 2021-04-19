import { Component, OnInit } from '@angular/core';
import { BodyComponent } from 'src/app/core/contracts';

@Component({
  selector: 'app-svg-viewer',
  templateUrl: './svg-viewer.component.html',
  styleUrls: ['./svg-viewer.component.sass']
})
export class SvgViewerComponent implements OnInit, BodyComponent {

  constructor() { }

  link(header: any) {
  
  }

  ngOnInit(): void {
  }

}
