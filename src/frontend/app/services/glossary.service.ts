import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { EventHubService } from 'src/frontend/app/services/eventhub.service';
import { WarehouseService } from 'src/frontend/app/services/warehouse.service';
import { BundleTags } from 'src/core/bundle/Bundle.tags';
import { IWorkspace, IResource } from 'src/core/editor/models';
import { Library } from 'src/core/library/Library';
import { LibraryTags } from 'src/core/library/library.tags';
import { PaoTags } from 'src/workers/pao/pao.tags';
import { IMessenger, IMessage } from 'src/core/report';
import { Glossary } from 'src/workers/tags/Glossary';
import { MetaTags } from 'src/workers/tags/meta.tags';
import { fixTagsDeclaration } from 'src/workers/tags/TagParser';
import { readGlossaryFromYaml } from 'src/workers/tags/YamlTagLexer';
import { Templating } from 'src/workers/templating/templating.tag';

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
    "📑request": MetaTags.metadata,
    "📐template": Templating.metadata,
    "🖨️pao": PaoTags.metadata,
    "📦bundle": BundleTags.metadata,
  }
  private _report = new BehaviorSubject<IReport[]>([]);

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
    try {
      const library = new Library(workspace);
      const data = readGlossaryFromYaml(this.mergeAll(workspace));
      fixTagsDeclaration(data);

      const glossary = new Glossary(MetaTags.metadata, Templating.metadata, PaoTags.metadata, BundleTags.metadata, data);
      this.raiseNewGlossary(glossary);
      this._report.next(this.getReportTags(workspace));
    } catch (exception) {
      this.hub.raiseError("fix the glossary");
      const report = this.getReportYaml(workspace);
      this._report.next(report);
    }
  }

  private getReportTags(workspace: IWorkspace) {
    const ret: IReport[] = [];
    for (let resource of workspace.resources) {
      const tags = new TagReader(resource, this.glossary);
      if (tags.undefinedCases.length > 0) {
        ret.push({
          resource: resource,
          errors: tags.undefinedCases
        });
      }
    }

    return ret;
  }

  private getReportYaml(workspace: IWorkspace) {
    const ret = [];
    const dict = new Map<string, IBlock>();
    for (let resource of workspace.resources) {

      const report = {
        resource: resource,
        errors: new Array<IBlock>()
      }

      const reader = new BlockReader(resource);

      if (reader.blocks.length == 0) {
        report.errors.push({
          name: LibraryTags.BOOK,
          startLineNumber: 0,
          endLineNumber: 0,
          startColumn: 0,
          endColumn: 0,
          message: "excepted ${LibraryTags.BOOK} tag: found an empty file.",
          lines: []
        });
      }
      else {
        const book = reader.blocks[0];
        if (book.name != LibraryTags.BOOK) {
          const clone = JSON.parse(JSON.stringify(book));
          clone.message = `excepted ${LibraryTags.BOOK} tag : found '${book.name}'.`;
          report.errors.push(clone);
        }
        else {
          reader.blocks.shift();
        }
      }

      for (let block of reader.blocks) {

        if (block.name) {
          if (dict[block.name]) {
            const def = dict[block.name];
            const clone = JSON.parse(JSON.stringify(block));
            clone.message = `'${block.name}' has already been defined at lines [${def.startLineNumber} - ${def.endLineNumber}], file '${def.resource.name}'.`;
            report.errors.push(clone);
          }
          else {
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
      if (report.errors.length > 0) {
        ret.push(report);
      }
    }
    return ret;
  }
}

export interface IBlock {
  name: string;
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
  message: string;
  lines: Array<string>;
}

export interface IReport {
  errors: Array<IBlock>;
  resource: IResource;
}

//
class TagReader {

  private readonly TAG_REGEX = /([^0-9a-zA-Z\s!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]+)([a-zA-Z]+\w*)/g
  public readonly undefinedCases = new Array<IBlock>();
  constructor(private readonly resource: IResource, private readonly glossary: Glossary) {

    let lineNumber = 1;
    for (let line of this.resource.content.split("\n")) {

      const matches = line.matchAll(this.TAG_REGEX);
      for (let match of matches) {
        const tag = match[1] + match[2];
        if (!this.glossary.get(tag)) {

          const msg: IBlock = {
            startLineNumber: lineNumber,
            startColumn: match.index + 1,
            endLineNumber: lineNumber,
            endColumn: match.index + 1 + tag.length,
            lines: [line],
            name: tag,
            message: `tag '${tag}' is undefined`
          }
          this.undefinedCases.push(msg);
        }
      }
      lineNumber++;
    }
  }
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
          startColumn: 0,
          endColumn: 1000,
          lines: [],
          message: ""
        }
      }
      else {
        block = {
          resource: this.resource,
          name: undefined,
          startLineNumber: blocks.length == 0 ? 1 : this.currentLine + 1,
          endLineNumber: this.currentLine + 1,
          lines: [],
          startColumn: 0,
          endColumn: 1000,
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

  private continue() {
    return this.currentLine < this.lines.length;
  }

  private next() {
    this.buffer.push(this.peak());
    this.currentLine++;
    return this.currentLine < this.lines.length;
  }
}
