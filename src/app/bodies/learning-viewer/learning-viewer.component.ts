import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/app/core/contracts';

@Component({
  selector: 'app-learning-viewer',
  templateUrl: './learning-viewer.component.html',
  styleUrls: ['./learning-viewer.component.sass']
})
export class LearningViewerComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent {

  constructor() {
    super();
  }

  link(header: any) {

  }

  ngOnInit(): void {
  }

}

