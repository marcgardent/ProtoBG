import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventHubService } from '../../services/eventhub.service';
import { HttpClient } from '@angular/common/http';
import { WarehouseService } from '../../services/warehouse.service';
import { MonacoService } from '../../services/monaco.service';
import { BodyComponent, ComponentBase } from 'src/app/core/contracts';

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