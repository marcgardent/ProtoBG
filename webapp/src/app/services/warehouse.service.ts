import { Injectable } from '@angular/core';
import { EventHubService } from './eventhub.service';
import { IWorkspace, IResource } from '../lib/editor/models';
import { BehaviorSubject, Subject } from 'rxjs';
import { FileSystemService } from './file-system.service';

const localStorageKey = "WAREHOUSE-R1";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private _currentWorkspace = new BehaviorSubject<IWorkspace>(undefined);
  private _currentResource = new BehaviorSubject<IResource>(undefined);
  private _onResourceUpdated = new Subject<IResource>();
  private _onResourceCreated = new Subject<IResource>();
  private _onResourceRenamed = new Subject<{ target: IResource, oldName: string }>();
  private _onWorkspaceUpdated = new Subject<IWorkspace>();

  public get currentWorkspace() { return this._currentWorkspace.asObservable(); }
  public get currentResource() { return this._currentResource.asObservable(); }
  public get onResourceUpdated() { return this._onResourceUpdated.asObservable(); }
  public get onResourceCreated() { return this._onResourceCreated.asObservable(); }
  public get onResourceRenamed() { return this._onResourceRenamed.asObservable(); }
  public get onWorkspaceUpdated() { return this._onWorkspaceUpdated.asObservable(); }

  get workspace() { return this._currentWorkspace.value; }
  get resource() { return this._currentResource.value; }

  constructor(private readonly hub: EventHubService, private readonly fs : FileSystemService) {
    this.currentWorkspace.subscribe((w) => { console.debug("⚡currentWorkspace", w) });
    this.currentResource.subscribe((w) => { console.debug("⚡currentResource", w) });
    this.onResourceUpdated.subscribe((w) => { console.debug("⚡onResourceUpdated", w) });
    this.onWorkspaceUpdated.subscribe((w) => { console.debug("⚡onWorkspaceUpdated", w) });
    this.onResourceCreated.subscribe((w) => { console.debug("⚡onResourceCreated", w) });
    this.onResourceRenamed.subscribe((w) => { console.debug("⚡onResourceRenamed", w) });
    this.fs.onLoaded.subscribe((payload) => {this.loadWorkspaceFromBackend(payload)});

    this.createWorkspace();
  }

  raiseResourceUpdated(resource: IResource) { this._onResourceUpdated.next(resource); }
  raiseWorkspaceUpdated(workspace: IWorkspace) {
    this.saveAll();
    this._onWorkspaceUpdated.next(workspace);
  }
  
  public renameResource(name: string) {
    this.resource.name = name;
    this.workspace.currentResource = this.resource.name;
    this._onResourceRenamed.next({target: this.resource, oldName: name });
    this.selectResource(this.resource);
  }

  public selectWorkspace(workspace: IWorkspace) {
    this._currentWorkspace.next(workspace);
    const resources = workspace.resources.filter(x => x.name == workspace.currentResource);
    if (resources.length == 1) {
      this.selectResource(resources[0]);
    }
    else if (workspace.resources.length > 0) {
      this.selectResource(workspace.resources[0]);
    }
    else {
      this.hub.raiseError("No resource in this workspace");
    }
  }

  public selectResource(resource: IResource) {
    const found = this.workspace.resources.filter(x => x.name == resource.name);
    if (found.length == 1) {
      this._currentWorkspace.value.currentResource = resource.name;
      this._currentResource.next(resource);
    }
    else {
      console.error('The user have selected an unknown resource in the current workspace.', resource, this.workspace);
    }
  }

  public createWorkspace() {
    const w = this.defaultWorkspace("/main.yml");
    this.selectWorkspace(w);
  }

  public createResource(name: any) {
    const r = this.defaultResource(name);
    this._currentWorkspace.value.resources.push(r);
    this.workspace.currentResource = r.name;
    this._onResourceCreated.next(r);
    this.selectResource(r);
  }

  private defaultWorkspace(resourceName): IWorkspace {
    return {
      currentResource: resourceName,
      saved: new Date().toUTCString(),
      resources: [this.defaultResource(resourceName)]
    }
  }

  private defaultResource(name): IResource {
    return { name: name, content: "#Your glossary", type: "glossary" }
  }

  private loadWorkspaceFromBackend(payload: string): void {
    if (payload) {
      try {
        let ret = <IWorkspace>JSON.parse(payload);
        this.selectWorkspace(ret);
      }
      catch (msg) {
        console.error("data corrupted: you loose your data if you save now, check your local-storage and report the incident!", msg);
        this.hub.raiseError("data corrupted!");
      }
    }
  }

  public saveAll() {
    this.workspace.saved = new Date().toUTCString();
    const dump = JSON.stringify(this.workspace);
    this.fs.save(dump);
    this.hub.raiseSuccess("Workspaces saved!");
  }
}