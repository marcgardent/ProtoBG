import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';
import { EventhubService } from './eventhub.service';
import { Glossary } from '../lib/tags/Glossary';
import { Entry } from '../lib/tags/Entry';
import { IWorkspace, IRessource } from '../lib/editor/models';
import { ThrowStmt } from '@angular/compiler';

const customLanguage = "markdown";

@Injectable({
  providedIn: 'root'
})
export class MonacoService {

  public tagSuggestions = [];
  public snippetSuggestions = [];
  private editor: monaco.editor.IStandaloneCodeEditor = undefined;

  constructor(private readonly hub: EventhubService) {

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

    this.hub.glossary.subscribe((g) => {
      if (g) { this.updateSuggestions(g) }
    });

    this.hub.workspace.subscribe((w) => {
      this.loadWorkspace(w);
    });

    this.hub.ressource.subscribe((r) => {
      this.loadRessource(r);
    });
  }

  public createEditor(domElement: HTMLDivElement): monaco.editor.IStandaloneCodeEditor {
    this.editor = monaco.editor.create(domElement, {
      //value: this.hub.ressource.value ? this.hub.ressource.value.content : "",
      //language: "markdown",
      contextmenu: true,
      minimap: { enabled: true },
      fontFamily: "game-icons, monospace"
    });

    this.loadWorkspace(this.hub.workspace.value);
    this.loadRessource(this.hub.ressource.value);

    return this.editor;
  }

  private loadRessource(ressource: IRessource){
    if(this.editor && ressource){
      const r = monaco.editor.getModels().filter(x=> x.uri.path== ressource.name);
      if(r.length==1){
        const model = r[0];
        this.editor.setModel(model);
      }
      else{
        console.error("model not loaded for", ressource);
        this.hub.onError.next("internal error [press F12]");
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

      for (let ressource of workspace.ressources) {

        const m = monaco.editor.createModel(ressource.content, this.getLanguage(ressource.type), monaco.Uri.file(ressource.name));
        console.debug("loaded", m.uri.path, m);
      }
    }
  }

  private getLanguage(ext: string) {
    if (ext == 'nunjucks') {
      return "html";
    }
    else {
      return "markdown"
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

      console.debug(tag.properties);

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
      provideRenameEdits: (model: monaco.editor.ITextModel, position: monaco.Position, newName: string) => {

        //custom range
        const theWord = model.getWordAtPosition(position);
        if (theWord) {
          const parsed = theWord.word.match(/([0-9]*)(.+)/);

          const match = new RegExp(parsed[2], "g");
          let lineNumber = 1;

          const edits = new Array<monaco.languages.WorkspaceTextEdit | monaco.languages.WorkspaceFileEdit>();

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
            console.debug("context", tagContext[1]);

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

    monaco.languages.registerHoverProvider(customLanguage, {
      provideHover: (model: monaco.editor.ITextModel, position: monaco.Position) => {

        const { column, lineNumber } = position;
        const theWord = model.getWordAtPosition(position);
        if (theWord && this.hub.glossary.value) {
          const parsed = theWord.word.match(/([0-9]*)([^:]*)/);
          const entry = this.hub.glossary.value.getAsEntry(parsed[2]);
          console.debug("theWord!", parsed[2]);
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