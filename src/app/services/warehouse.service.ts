import { Injectable } from '@angular/core';
import { EventhubService } from './eventhub.service';
import { IWarehouse } from '../lib/editor/models';


const localStorageKey = "WAREHOUSE-R1";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private readonly hub : EventhubService) {
    
    const warehouse = this.loadWarehouseFromLocalStorage();
    const workspace = warehouse && warehouse.workspaces.length > 0 ? warehouse.workspaces[0] : undefined;
    const ressource = workspace && workspace.ressources.length > 0  ? workspace.ressources[0] : undefined;

    hub.currentWarehouse.next(warehouse);
    hub.currentWorkspace.next(workspace);
    hub.currentRessource.next(ressource);

    hub.onWorkspaceUpdated.subscribe(x=> {
      this.saveAll();
    });
  }

  private loadWarehouseFromLocalStorage(): IWarehouse {
    let ret = { workspaces: [{ name: 'default', ressources: [{ name: "/default.yml", content: "#TODO2", type: "glossary" }] }] };
    const text = localStorage.getItem(localStorageKey);
    if (text) {
      try {
        ret = <IWarehouse>JSON.parse(text);
      }
      catch (msg) {
        console.error("data corrupted: you loose your data if you save now, check your localstorage and report the incident!", msg);
        this.hub.onError.next("data corrupted: you loose your data if you save now, press F12 for more information.");
      }
    }
    return ret;
  }

  public saveAll() {
    const dump = JSON.stringify(this.hub.currentWarehouse.value);
    localStorage.setItem(localStorageKey, dump);
    this.hub.onSuccess.next("Workspaces saved!");
  }
}