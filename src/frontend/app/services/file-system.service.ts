import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IWorkspace } from 'src/core/models';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  private _onLoaded = new Subject<IWorkspace>();
  public get onLoaded() { return this._onLoaded.asObservable(); }

  private readonly context = (window as any).fileManager;
  public folder: string = undefined;
  public get opened() { return this.folder !== undefined; }
  constructor() {
    this.context.folderChanged((x) => {
    this.folder = x;
    });

    this.context.dumpLoaded((payload) => {
      this._onLoaded.next(payload);
    })
  }
  
  public load() {
    return this.context.loadDump();
  }

  public reload() {
    if (this.folder){ this.context.reloadDump(); }
  }
  
  public save(payload : IWorkspace){
    this.context.saveDump(payload);
  }
}