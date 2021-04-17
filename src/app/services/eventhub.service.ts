import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventHubService {
  
  private _onError = new Subject<string>();
  private _onSuccess = new Subject<string>();

  public get onError() { return this._onError.asObservable(); }
  public get onSuccess() { return this._onSuccess.asObservable(); }

  raiseError(message: string) { this._onError.next(message); }
  raiseSuccess(message: string) { this._onSuccess.next(message); }

  constructor() {
    this.registerConsole();
  }
 

  registerConsole() {    
    this.onError.subscribe((w) => { console.debug("⚡onError", w) });
    this.onSuccess.subscribe((w) => { console.debug("⚡onSuccess", w) });
  }
}
