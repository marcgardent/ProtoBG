import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IWarehouse, IWorkspace, IRessource } from '../lib/editor/models';
import { Glossary } from '../lib/tags/Glossary';


@Injectable({
  providedIn: 'root'
})
export class EventhubService {

  public warehouse = new BehaviorSubject<IWarehouse>(undefined);
  public workspace = new BehaviorSubject<IWorkspace>(undefined);
  public ressource = new BehaviorSubject<IRessource>(undefined);
  public glossary = new BehaviorSubject<Glossary>(undefined);
  
  public onError = new Subject<string>();
  public onSuccess = new Subject<string>();

  constructor() {

  }
}
