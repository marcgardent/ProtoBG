import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DefaultLibrary, Library } from 'src/core/library/library';
import { IBook, IWorkspace } from 'src/core/models';
import { EventHubService } from 'src/frontend/app/services/eventhub.service';
import { WarehouseService } from 'src/frontend/app/services/warehouse.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private _onLibrary = new BehaviorSubject<Library>(DefaultLibrary);
  public get onLibrary() { return this._onLibrary.asObservable() }
  public get library() { return this._onLibrary.value }

  constructor(private readonly hub : EventHubService, private readonly warehouse: WarehouseService) {
    this.warehouse.currentWorkspace.subscribe((w) => {
      if (w) { this.updatelibrary(w); }
    });

    this.warehouse.onWorkspaceUpdated.subscribe((w) => {
      if (w) { this.updatelibrary(w); }
    });
  }

  updatelibrary(w: IWorkspace) {
    const process = new Library(this.hub, w);
    this._onLibrary.next(process);
  }
}