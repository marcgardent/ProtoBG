import { Injectable } from '@angular/core';
import { EventHubService } from './eventhub.service';
import { IWorkspace, IResource } from '../lib/editor/models';
import { fixTagsDeclaration } from '../lib/tags/TagParser';
import { readGlossaryFromYaml } from '../lib/tags/YamlTagLexer';
import { Glossary } from '../lib/tags/Glossary';
import { MetaTags } from '../lib/tags/meta.tags';
import { Templating } from '../lib/templating/templating.tag';
import { PaoTags } from '../lib/pao/pao.tags';
import { BundleTags } from "../lib/bundle/Bundle.tags";
import { WarehouseService } from './warehouse.service';
import { BehaviorSubject } from 'rxjs';
import { exception } from 'console';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService {

  private _report = new BehaviorSubject<IReport[]>([]);
  get reports() { return this._report.asObservable(); }

  get glossary() { return this._currentGlossary.value; }
  private _currentGlossary = new BehaviorSubject<Glossary>(new Glossary(MetaTags.metadata, Templating.metadata, PaoTags.metadata, BundleTags.metadata));

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


  private raiseNewGlossary(glossary: Glossary) {
    this._currentGlossary.next(glossary);
  }

  public mergeAll(workspace: IWorkspace): string {
    if (workspace) {
      return '\n'.concat(...workspace.resources.filter(x => x.type === 'glossary').map(x => x.content));
    }
    else {
      return "";
    }
  }

  private updateGlossary(workspace: IWorkspace) {
    try {
      const data = readGlossaryFromYaml(this.mergeAll(workspace));
      fixTagsDeclaration(data);
      const glossary = new Glossary(MetaTags.metadata, Templating.metadata, PaoTags.metadata, BundleTags.metadata, data);
      this.raiseNewGlossary(glossary);
      this._report.next([]);
    } catch (exception) {
      this.hub.raiseError("fix the glossary");
      const report = this.getReport(workspace);
      this._report.next(report);
    }
  }

  private getReport(workspace: IWorkspace) {
    const ret = [];
    const dict = new Map<string,IBlock>();
    for (let resource of workspace.resources) {

      const report = {
        resource: resource,
        errors: new Array<IBlock>()
      }

      const reader = new BlockReader(resource);
      
      for (let block of reader.blocks) {
        
        if(block.name){
          if(dict[block.name]){
            const def = dict[block.name];
            const clone = JSON.parse(JSON.stringify(block));

            clone.message = `'${block.name}' has already been defined at lines [${def.startLineNumber} - ${def.endLineNumber}], file '${def.resource.name}'.`;
            report.errors.push(clone);
          }
          else{
            dict[block.name] = block;
          }
        }

        try {
          readGlossaryFromYaml(block.lines.join("\n"));
        }
        catch (error) {
          block.message = `${error.name}: ${error.message}`;
          report.errors.push(block);
          //console.debug(error.source.range.start, error.source.range.end);
        }
      }

      ret.push(report);
    }
    return ret;
  }
}

export interface IBlock {
  name: string;
  startLineNumber: number;
  endLineNumber: number;
  lines: Array<string>;
  message: string;
}

export interface IReport {
  errors: Array<IBlock>;
  resource: IResource;
}

class BlockReader {
  private readonly lines: string[];
  private currentLine = 0;
  private buffer = [];
  public readonly blocks: Array<IBlock>;

  constructor(public readonly resource: IResource) {
    this.lines = this.resource.content.split("\n");
    this.blocks = this.toBlock();
  }

  private toBlock() {
    const blocks = new Array<IBlock>();
    do {
      const entry = this.whileEntry();
      let block;
      if (entry) {
        block = {
          resource: this.resource,
          name: entry,
          startLineNumber: blocks.length == 0 ? 1 : this.currentLine + 1,
          endLineNumber: this.currentLine + 1,
          lines: [],
          message: ""
        }
      }
      else{
        block = {
          resource: this.resource,
          name: undefined,
          startLineNumber: blocks.length == 0 ? 1 : this.currentLine + 1,
          endLineNumber: this.currentLine + 1,
          lines: [],
          message: ""
        }
      }

      block.endLineNumber += this.readBlock();
      block.lines = this.buffer; this.buffer = [];
      blocks.push(block);

    } while (this.continue());
    return blocks;
  }

  private readBlock() {
    let ret = 0;
    this.next();
    do {
      const line = this.peak();
      const parsed = line.match(/^([^#:\s][^:]*(\s*)):/);
      if (!parsed) {
        ret += 1;
      }
      else {
        return ret;
      }
    } while (this.next());

    return ret;
  }

  private whileEntry() {
    do {
      const line = this.peak();
      const parsed = line.match(/^([^#:\s][^:]*(\s*)):/);
      if (parsed) {
        return parsed[1];
      }
    } while (this.next());

    return undefined;
  }

  private peak() {
    return this.lines[this.currentLine];
  }

  private continue(){
    return this.currentLine < this.lines.length;
  }

  private next() {
    this.buffer.push(this.peak());
    this.currentLine++;
    return this.currentLine < this.lines.length;
  }
}
