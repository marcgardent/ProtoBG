import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/frontend/app/layout/contracts';
import { EventHubService } from 'src/frontend/app/services/eventhub.service';
import { MonacoService } from 'src/frontend/app/services/monaco.service';
import { WarehouseService } from 'src/frontend/app/services/warehouse.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.less']
})
export class ConfigurationComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent {

  public endpoint: string;
  constructor(private readonly warehouse:WarehouseService, private readonly monacoService:MonacoService, private readonly hub: EventHubService, private readonly http: HttpClient) {
    super();
   }

  link(header: any) {
    
  }

  ngOnInit() {
    this.endpoint = localStorage.getItem("protoBG:endpoint");
  } 
}