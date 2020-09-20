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

@Injectable({
  providedIn: 'root'
})
export class GlossaryService {

  get glossary() { return this._currentGlossary.value; }
  private _currentGlossary = new BehaviorSubject<Glossary>(undefined);

  constructor(private readonly hub: EventHubService, private readonly warehouse: WarehouseService) {

    this.currentGlossary.subscribe((w) => { console.debug("⚡currentGlossary", w) });

    this.warehouse.currentWorkspace.subscribe((w) => {
      if (w) { this.updateGlossary(w); }
    });

    this.warehouse.onWorkspaceUpdated.subscribe((w) => {
      if (w) { this.updateGlossary(w); }
    });

    this.raiseNewGlossary(new Glossary(MetaTags.metadata, Templating.metadata, PaoTags.metadata, BundleTags.metadata));
  }

  public get currentGlossary() { return this._currentGlossary.asObservable(); }
  raiseNewGlossary(glossary: Glossary) {
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

    } catch (exception) {
      this.hub.raiseError("fix the glossary");
      console.error(exception);

      this.parseErrors(workspace);
    }
  }

  private parseErrors(workspace: IWorkspace) {
    for (let resource of workspace.resources) {
      const block = new BlockReader(resource);
      console.debug(block.blocks);
    }
  }
}

export interface IBlock {
  resource: IResource;
  name: string;
  startLineNumber: number;
  endLineNumber: number;
}

class BlockReader {
  private readonly lines: string[];
  private currentLine = 0;
  public readonly blocks: Array<IBlock>;

  constructor(public readonly resource: IResource) {
    this.lines = this.resource.content.split("\n");
    this.blocks = this.toBlock();
  }

  private toBlock() {
    const blocks = new Array<IBlock>();

    do {
      const entry = this.whileEntry();
      if (entry) {
        const block = {
          resource: this.resource,
          name: entry,
          startLineNumber: blocks.length==0? 1: this.currentLine + 1,
          endLineNumber: this.currentLine + 1
        }
        block.endLineNumber+= this.readBlock();
        blocks.push(block);
      }
    } while (this.next());

    return blocks;
  }

  private readBlock() {
    let ret =0;
    this.next();
    do {
      const line = this.peak();
      const parsed = line.match(/^([^#:\s][^:]*(\s*)):(\s*)$/);
      if (!parsed) {
        ret+=1;
      }
      else{
        return ret;
      }
    } while (this.next());

    return ret;
  }

  private whileEntry() {
    do {
      const line = this.peak();
      const parsed = line.match(/^([^#:\s][^:]*(\s*)):(\s*)$/);
      if (parsed) {
        return parsed[1];
      }
    } while (this.next());

    return undefined;
  }

  private peak() {
    return this.lines[this.currentLine];
  }

  private next() {
    this.currentLine++;
    return this.currentLine < this.lines.length;
  }
}
