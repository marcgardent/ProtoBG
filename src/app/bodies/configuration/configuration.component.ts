import { Component, OnInit } from '@angular/core';
import { EventHubService } from '../../services/eventhub.service';
import { HttpClient } from '@angular/common/http';
import { WarehouseService } from '../../services/warehouse.service';
import { MonacoService } from '../../services/monaco.service';
import { BodyComponent } from 'src/app/core/contracts';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.less']
})
export class ConfigurationComponent implements OnInit, BodyComponent {

  public endpoint: string;
  constructor(private readonly warehouse:WarehouseService, private readonly monacoService:MonacoService, private readonly hub: EventHubService, private readonly http: HttpClient) { }

  link(header: any) {
    
  }

  ngOnInit() {
    this.endpoint = localStorage.getItem("protoBG:endpoint");
  } 
}