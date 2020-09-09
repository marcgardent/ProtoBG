import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IWarehouse, IWorkspace, IRessource } from '../lib/editor/models';
import { Glossary } from '../lib/tags/Glossary';


@Injectable({
  providedIn: 'root'
})
export class EventhubService {

  public currentWarehouse = new BehaviorSubject<IWarehouse>(undefined);
  public currentWorkspace = new BehaviorSubject<IWorkspace>(undefined);
  public currentRessource = new BehaviorSubject<IRessource>(undefined);
  public currentGlossary = new BehaviorSubject<Glossary>(undefined);

  public onError = new Subject<string>();
  public onSuccess = new Subject<string>();
  public onRessourceUpdated = new Subject<IRessource>();
  public onWorkspaceUpdated = new Subject<IWorkspace>();

  constructor() {
    this.registerConsole();
  }

  registerConsole() {

    this.currentWarehouse.subscribe((w) => { console.debug("⚡currentWarehouse", w) });
    this.currentWorkspace.subscribe((w) => { console.debug("⚡currentWorkspace", w) });
    this.currentRessource.subscribe((w) => { console.debug("⚡currentRessource", w) });
    this.currentGlossary.subscribe((w) => { console.debug("⚡currentGlossary", w) });
    this.onError.subscribe((w) => { console.debug("⚡onError", w) });
    this.onSuccess.subscribe((w) => { console.debug("⚡onSuccess", w) });
    this.onRessourceUpdated.subscribe((w) => { console.debug("⚡onRessourceUpdated", w) });
    this.onWorkspaceUpdated.subscribe((w) => { console.debug("⚡onWorkspaceUpdated", w) });

  }
}
