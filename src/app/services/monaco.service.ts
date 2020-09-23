import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';
import { EventHubService } from './eventhub.service';
import { Glossary } from '../lib/tags/Glossary';
import { Entry } from '../lib/tags/Entry';
import { IWorkspace, IResource } from '../lib/editor/models';
import { GlossaryService, IBlock, IReport } from './glossary.service';
import { WarehouseService } from './warehouse.service';

const customLanguage = "markdown";
const YAML_OWNER = "YAML_PARSER";

@Injectable({
  providedIn: 'root'
})
export class MonacoService {

  public tagSuggestions = [];
  public snippetSuggestions = [];
  private editor: monaco.editor.IStandaloneCodeEditor = undefined;

  constructor(private readonly warehouseService: WarehouseService, private readonly glossaryService: GlossaryService, private readonly hub: EventHubService) {

    monaco.editor.setTheme("vs-dark");

    window["MonacoEnvironment"] = {
      getWorker: (moduleId, label) => {
        if (label == "editorWorkerService") {
          return new Worker("node_modules/monaco-editor/esm/vs/editor/editor.worker.js", { type: 'module' });
        }
        else {
          console.exception("unknown monaco worker", moduleId, label);
          throw ("not implemented");
        }
      }
    };

    this.registerCustomLanguage();

    this.glossaryService.currentGlossary.subscribe((g) => {
      if (g) { this.updateSuggestions(g) }
    });

    this.warehouseService.currentWorkspace.subscribe((w) => {
      this.loadWorkspace(w);
    });

    this.warehouseService.currentResource.subscribe((r) => {
      this.loadResource(r);
    });

    this.warehouseService.onResourceCreated.subscribe((r) => {
      monaco.editor.createModel(r.content, this.getLanguage(r.type), monaco.Uri.file(r.name));
    });

    this.warehouseService.onResourceRenamed.subscribe((d) => {

      const old = this.getModel(d.oldName);
      if (old) {
        old.dispose();
      }
      monaco.editor.createModel(d.target.content, this.getLanguage(d.target.type), monaco.Uri.file(d.target.name));
    });

    this.glossaryService.reports.subscribe((reports: IReport[]) => {
      for (let report of reports) {
        const model = this.getModel(report.resource.name);
        if (model) {
          const markers = report.errors.map(x => ({
            startLineNumber: x.startLineNumber,
            startColumn: 1,
            endLineNumber: x.endLineNumber,
            endColumn: 1000,
            severity: monaco.MarkerSeverity.Error,
            message: x.message
          }));
          monaco.editor.setModelMarkers(model, YAML_OWNER, markers);
        }
      }
    });
  }

  public rehydrateWorkspace() {
    if (this.warehouseService.workspace) {
      for (let resource of this.warehouseService.workspace.resources) {
        this.rehydrateResource(resource);
      }
      this.warehouseService.raiseWorkspaceUpdated(this.warehouseService.workspace);
    }
  }

  private rehydrateResource(resource: IResource) {
    if (resource) {
      const model = this.getModel(resource.name);
      if (model) {
        resource.content = model.getValue();
        this.warehouseService.raiseResourceUpdated(resource);
      }
      else {
        console.error("model not loaded for", resource);
        this.hub.raiseError("internal error [press F12]");
      }
    }
  }

  public createEditor(domElement: HTMLDivElement): monaco.editor.IStandaloneCodeEditor {



    this.editor = monaco.editor.create(domElement, {
      //value: this.hub.resource.value ? this.hub.resource.value.content : "",
      //language: "markdown",
      contextmenu: true,
      minimap: { enabled: true },
      fontFamily: "game-icons, monospace"
    });

    const codeEditorService = (<any>this.editor)._codeEditorService;
    codeEditorService.openCodeEditor = ({ resource, options }) => {
      const file = resource.path;
      const range = options.selection;
      this.goto(file, range);
    }

    this.editor.onDidChangeModelContent((e) => {
      //reset markers
      for(let model of monaco.editor.getModels()){
        monaco.editor.setModelMarkers(model , YAML_OWNER, []);
      }
    });

    this.loadWorkspace(this.warehouseService.workspace);
    this.loadResource(this.warehouseService.resource);

    return this.editor;
  }

  public goto(path: string, range: monaco.IRange) {
    const model = this.getModel(path);
    if (model) {
      this.editor.setModel(model);
      //this.editor.revealLine(lineNumber);
      this.editor.revealRangeAtTop(range);
      monaco.editor.setModelMarkers(model, "GOTO_FUNC", [{
        endColumn: range.endColumn,
        endLineNumber: range.endLineNumber,
        startColumn: range.startColumn,
        startLineNumber: range.startLineNumber,
        severity: monaco.MarkerSeverity.Info,
        message: "definition"
      }])
    }
    setTimeout(() => {
      monaco.editor.setModelMarkers(model, "GOTO_FUNC", []);
    }, 2000);
  }

  private getModel(name: string) {
    const r = monaco.editor.getModels().filter(x => x.uri.path == name);
    if (r.length == 1) {
      return r[0];
    }
    else {
      return undefined;
    }
  }

  private loadResource(resource: IResource) {
    if (this.editor && resource) {
      const r = this.getModel(resource.name);
      if (r) {
        this.editor.setModel(r);
      }
      else {
        console.error("model not loaded for", resource);
        this.hub.raiseError("internal error [press F12]");
      }
    }
  }

  private loadWorkspace(workspace: IWorkspace) {

    if (this.editor && workspace) {

      //resets models
      this.editor.setModel(null);
      for (let model of monaco.editor.getModels()) {
        model.dispose();
      }

      for (let resource of workspace.resources) {
        const m = monaco.editor.createModel(resource.content, this.getLanguage(resource.type), monaco.Uri.file(resource.name));
      }
    }
  }

  private getLanguage(ext: string) {
    if (ext == 'nunjucks') {
      return "html";
    }
    else if (ext == 'glossary') {
      return customLanguage;
    }
    else {
      console.warn("undefined ext.", ext);
      return null;
    }
  }

  private updateSuggestions(glossary: Glossary) {

    this.tagSuggestions = [];
    this.snippetSuggestions = [];
    for (let [index, tag] of Object.entries(glossary.glossary)) {

      const entry = new Entry(glossary, tag);
      this.tagSuggestions.push({
        _entry: entry,
        label: index,
        filterText: tag.name,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: index,
        sortText: index,
        documentation: {
          value: `## ${entry.displayName}
        
${entry.description}

**tags:** ${entry.tagAsEntries.map(x => x.displayName).join(", ")}
**implements:** ${entry.properties.join(", ")}
`}
      });

      {
        // snippets
        const props = entry.properties;
        if (props.length > 0) {
          const insertText = []

          insertText.push(`${entry.icon}\$\{1:name\}:`);
          insertText.push(`  tags: ${entry.canonicalName}`);
          let tab = 1;
          for (let prop of props) {
            tab++;
            insertText.push(`  ${prop}: \$${tab}`);
          }

          this.snippetSuggestions.push({
            label: tag.name,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            insertText: insertText.join("\n")
          });
        }
      }
    }
  }

  private registerCustomLanguage() {
    // this.monaco.languages.register({'id': customLanguage})
    monaco.languages.registerRenameProvider(customLanguage, {
      provideRenameEdits: (target: monaco.editor.ITextModel, position: monaco.Position, newName: string) => {
        //custom range
        const theWord = target.getWordAtPosition(position);
        if (theWord) {
          const parsed = theWord.word.match(/([0-9]*)(.+)/);

          const match = new RegExp(parsed[2], "g");


          const edits = new Array<monaco.languages.WorkspaceTextEdit | monaco.languages.WorkspaceFileEdit>();

          for (let model of monaco.editor.getModels()) {
            let lineNumber = 1;
            for (let line of model.getLinesContent()) {
              for (let matched of [...line.matchAll(match)]) {
                edits.push({
                  resource: model.uri,
                  edit: {
                    range: {
                      endColumn: matched.index + 1 + matched[0].length,
                      endLineNumber: lineNumber,
                      startColumn: matched.index + 1,
                      startLineNumber: lineNumber,
                    },
                    text: newName
                  }
                });
              }
              lineNumber++;
            }
          }
          const ret = {
            edits: edits
          }
          return ret;
        }
        else {
          return { rejectReason: "not possible to rename here!", edits: [] }
        }
      }
    });

    monaco.languages.registerCompletionItemProvider(customLanguage, {
      //triggerCharacters: [' '],
      provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position, context) => {
        if (position.column === 1) {
          return { suggestions: this.snippetSuggestions };
        } else {

          //Default range
          let range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column,
          };

          //custom range
          const theWord = model.getWordAtPosition(position);
          if (theWord) {
            const parsed = theWord.word.match(/([0-9]*)([^:]*)/);
            if (parsed[1].length == 0) {
              range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: theWord.startColumn,
                endColumn: theWord.endColumn,

              };
            }
          }

          // sort suggestions
          const tagContext = (<string>model.getLineContent(position.lineNumber)).match(/^\s+((\W+)(\w+)):/);
          if (tagContext) {
            this.tagSuggestions.forEach(suggestion => {
              suggestion.range = range;
              if (suggestion._entry.tags.indexOf(tagContext[1]) >= 0) {

                suggestion.sortText = "__" + suggestion.insertText;
                suggestion.label = suggestion.insertText + " 💖";
              }
              else if (tagContext[1].startsWith(suggestion._entry.icon)) {
                suggestion.sortText = "_" + suggestion.insertText;
                suggestion.label = suggestion.insertText + " 🤍";
              }
              else {
                suggestion.label = suggestion.sortText = suggestion.insertText;
              }
            });
          }
          else {
            this.tagSuggestions.forEach(x => { x.range = range; x.sortText = x.insertText });
          }
          return { suggestions: this.tagSuggestions };
        }

      }
    });

    monaco.languages.registerDefinitionProvider(customLanguage, {
      provideDefinition: (target: monaco.editor.ITextModel, position: monaco.Position) => {
        const theWord = target.getWordAtPosition(position).word.match(/[0-9]*(.*)/)[1];
        const result = [];
        for (let model of monaco.editor.getModels()) {
          let lineNumber = 1;
          for (let line of model.getLinesContent()) {
            if (line.startsWith(theWord)) {
              result.push({
                uri: model.uri,
                range: {
                  startLineNumber: lineNumber,
                  startColumn: 1,
                  endLineNumber: lineNumber,
                  endColumn: line.length,
                }
              });
            }
            lineNumber++;
          }
        }
        return result;
      }
    }
    );

    monaco.languages.registerHoverProvider(customLanguage, {
      provideHover: (model: monaco.editor.ITextModel, position: monaco.Position) => {

        const { column, lineNumber } = position;
        const theWord = model.getWordAtPosition(position);
        if (theWord && this.glossaryService.glossary) {
          const parsed = theWord.word.match(/([0-9]*)([^:]*)/);
          const entry = this.glossaryService.glossary.getAsEntry(parsed[2]);
          if (entry.isValid) {
            return {
              range: new monaco.Range(lineNumber, theWord.startColumn, lineNumber, theWord.endColumn),
              contents: [
                { value: `## ${entry.displayName}` },
                { value: `**tags:** ${entry.tagAsEntries.map(x => x.displayName).join(", ")}` },
                { value: `**description:** ${entry.description}` },
                { value: `**implements:** ${entry.properties.join(", ")}` }
              ]
            }
          }
          else {
            return undefined;
          }
        } else {
          return undefined;
        }
      }
    });
  }
}