import { Component } from '@angular/core';
import { EventHubService } from 'src/frontend/app/services/eventhub.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent {

  constructor(private readonly hub: EventHubService) {

  }

  resize() {
    this.hub.resizeArea.next();
  }

  resizing() {
    this.hub.resizingArea.next();
  }
}
