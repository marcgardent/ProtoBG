import { Component, OnInit } from '@angular/core';
import { EventHubService } from '../services/eventhub.service';
import { HttpClient } from '@angular/common/http';
import { IWarehouse } from '../lib/editor/models';
import { WarehouseService } from '../services/warehouse.service';
import { MonacoService } from '../services/monaco.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.less']
})
export class ConfigurationComponent implements OnInit {

  public endpoint: string;
  constructor(private readonly warehouse:WarehouseService, private readonly monacoService:MonacoService, private readonly hub: EventHubService, private readonly http: HttpClient) { }

  ngOnInit() {
    this.endpoint = localStorage.getItem("protoBG:endpoint");
  }

  public push() {
    this.monacoService.rehydrateWorkspace();
    
    const w = this.warehouse.current;
    if (w && w.workspaces.length > 0) {
      const payload = JSON.stringify(w);
      this.http.post(this.endpoint, payload).toPromise()
        .then(() => {
          this.hub.raiseSuccess("pushed!");
        }).catch(r => {
          this.hub.raiseError("an error occurred when push: see logs");
          console.error("an error occurred when push", r);
        });
      localStorage.setItem("protoBG:endpoint", this.endpoint);
    }
  }

  public pull() {
    this.http.get(this.endpoint, { responseType: 'text' }).toPromise().then(x => {
      const warehouse = <IWarehouse>JSON.parse(x);
      this.hub.raiseSuccess("pulled!");
      this.warehouse.loadWarehouse(warehouse);
    }).catch(r => {
      console.debug(r);
      this.hub.raiseError("an error occurred when pull: see logs");
    });
    localStorage.setItem("protoBG:endpoint", this.endpoint);
  }
}