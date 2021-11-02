import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComponentBase, BodyComponent } from 'src/frontend/app/layout/contracts';
import { EventHubService } from 'src/frontend/app/services/eventhub.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.sass']
})
export class ConsoleComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent {
  public get logs() { return this.hub.logs }

  constructor(private hub: EventHubService) {
    super();
  }

  link(header: any) { }

  ngOnInit(): void { }
  
}
