import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { EventHubService } from 'src/frontend/app/services/eventhub.service';
import { WarehouseService } from 'src/frontend/app/services/warehouse.service';
import { BundleTags } from 'src/workers/bundle/Bundle.tags';
import { IWorkspace} from 'src/core/models';
import { Library } from 'src/core/library/Library';
import { PaoTags } from 'src/workers/pao/pao.tags';
import { IMessenger, IMessage } from 'src/core/report';
import { Glossary } from 'src/core/glossary/Glossary';
import { SearchTags } from 'src/workers/tags/search.tags';
import { readGlossaryFromYaml } from 'src/core/glossary/GlossaryReader';
import { Templating } from 'src/workers/templating/templating.tag';
import { IReport } from 'src/core/linter/models';
import { Linter } from 'src/core/linter/Linter';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService implements IMessenger {

  public runtimeErrors = new Array<IMessage>();
  public _runtimeError = new Subject<IMessage>();

  public get reports() { return this._report.asObservable(); }
  public get runtimeError() { return this._runtimeError.asObservable(); }
  public get glossary() { return this._currentGlossary.value; }

  private static builtinGlossaries = {
    "📑request": SearchTags.metadata,
    "📐template": Templating.metadata,
    "🖨️pao": PaoTags.metadata,
    "📦bundle": BundleTags.metadata,
  }

  private _report = new BehaviorSubject<IReport[]>([]);

  private _currentGlossary = new BehaviorSubject<Glossary>(new Glossary(SearchTags.metadata, Templating.metadata, PaoTags.metadata, BundleTags.metadata));

  constructor(private readonly hub: EventHubService, private readonly warehouse: WarehouseService) {

    this.currentGlossary.subscribe((w) => { console.debug("⚡currentGlossary", w) });
    this.reports.subscribe((w) => { console.debug("⚡report", w) });

    this.warehouse.currentWorkspace.subscribe((w) => {
      if (w) { this.updateGlossary(w); }
    });

    this.warehouse.onWorkspaceUpdated.subscribe((w) => {
      if (w) { this.updateGlossary(w); }
    });
  }

  public get currentGlossary() { return this._currentGlossary.asObservable(); }

  public error(m: IMessage) {
    console.debug("🔥", m);
    this._runtimeError.next(m);
    this.runtimeErrors.push(m);
  }

  public mergeAll(workspace: IWorkspace): string {
    if (workspace) {
      return '\n'.concat(...workspace.resources.filter(x => x.type === 'glossary').map(x => x.content));
    }
    else {
      return "";
    }
  }

  clearRuntimeErrors() {
    this.runtimeErrors = [];
  }

  private raiseNewGlossary(glossary: Glossary) {
    this._currentGlossary.next(glossary);
  }

  private updateGlossary(workspace: IWorkspace) {
    const linter = new Linter(this.hub);
    try {
      const library = new Library(this.hub, workspace);
      const data = readGlossaryFromYaml(this.mergeAll(workspace));
      const glossary = new Glossary(SearchTags.metadata, Templating.metadata, PaoTags.metadata, BundleTags.metadata, data);
      this.raiseNewGlossary(glossary);

      this._report.next(linter.lintTags(this.glossary, workspace));
    } catch (exception) {
      this.hub.snack("fix the glossary: see the report");
      const report = linter.lintYaml(workspace);
      this._report.next(report);
    }
  }
}