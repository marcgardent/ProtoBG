import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IWarehouse, IWorkspace, IResource } from '../lib/editor/models';
import { Glossary } from '../lib/tags/Glossary';


@Injectable({
  providedIn: 'root'
})
export class EventHubService {

  public currentWarehouse = new BehaviorSubject<IWarehouse>(undefined);
  public currentWorkspace = new BehaviorSubject<IWorkspace>(undefined);
  public currentResource = new BehaviorSubject<IResource>(undefined);
  public currentGlossary = new BehaviorSubject<Glossary>(undefined);

  public onError = new Subject<string>();
  public onSuccess = new Subject<string>();
  public onResourceUpdated = new Subject<IResource>();
  public onWorkspaceUpdated = new Subject<IWorkspace>();

  constructor() {
    this.registerConsole();
  }

  registerConsole() {

    this.currentWarehouse.subscribe((w) => { console.debug("⚡currentWarehouse", w) });
    this.currentWorkspace.subscribe((w) => { console.debug("⚡currentWorkspace", w) });
    this.currentResource.subscribe((w) => { console.debug("⚡currentResource", w) });
    this.currentGlossary.subscribe((w) => { console.debug("⚡currentGlossary", w) });
    this.onError.subscribe((w) => { console.debug("⚡onError", w) });
    this.onSuccess.subscribe((w) => { console.debug("⚡onSuccess", w) });
    this.onResourceUpdated.subscribe((w) => { console.debug("⚡onResourceUpdated", w) });
    this.onWorkspaceUpdated.subscribe((w) => { console.debug("⚡onWorkspaceUpdated", w) });

  }
}
