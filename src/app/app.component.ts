import { Component, OnInit, HostListener } from '@angular/core';
import { readGlossaryFromYaml } from './lib/tags/YamlTagLexer';
import { exportAsTypescript } from './lib/tags/TypescriptExporter';
import { fixTagsDeclaration } from './lib/tags/TagParser';
import { Pao } from './lib/pao/pao.tags';
import { Glossary } from './lib/tags/Glossary';
import { TagExpression } from './lib/tags/TagExpression';
import { PaoContext } from './lib/pao/PaoContext';
import { CodeModel, CodeEditorService } from '@ngstack/code-editor';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { MatSnackBar } from '@angular/material/snack-bar';
import { gameIcons } from './lib/gameicons/gameicons';
import { DomSanitizer } from '@angular/platform-browser';
import { MetaTags } from './lib/tags/meta.tags';
import { Templating } from './lib/templating/templating.tag';
import { Entry } from './lib/tags/Entry';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  theme = 'vs';

  codeModel: CodeModel = {
    language: 'markdown',
    uri: 'printing.markdown',
    value: 'content',
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
    fontFamily: "game-icons, monospace"
  };

  private readonly defaultPrinting = { icon: '🖨️', name: 'Print' };
  private glossary = new Glossary(MetaTags.metadata, Templating.metadata, Pao.metadata);
  private monaco: any;
  public definitions = [];
  public tagSuggestions = [];
  public snippetSuggestions = [];
  public gameIcons = gameIcons;
  public printings = [];
  public currentPrinting: any = this.defaultPrinting;

  constructor(private readonly editorService: CodeEditorService, private snackBar: MatSnackBar, private readonly sanitizer: DomSanitizer) {

    const txt = localStorage.getItem("protobg-code");
    if (txt) {
      this.content = txt;
    }

    editorService.loaded.subscribe(res => {
      this.monaco = res.monaco;
      const self = this;

      // this.monaco.languages.register({'id': this.codeModel.language})

      this.monaco.languages.registerRenameProvider(this.codeModel.language, {
        provideRenameEdits: (model, position, newName) => {

          //custom range
          const theWord = model.getWordAtPosition(position);
          if (theWord) {
            const parsed = theWord.word.match(/([0-9]*)(.+)/);

            const match = new RegExp(parsed[2], "g");
            let lineNumber = 1;

            const edits = new Array();

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
            console.debug(ret);
            return ret;
          }
          else {
            return { rejectReason: "not possible to rename here!" }
          }
        }
      });

      this.monaco.languages.registerCompletionItemProvider(this.codeModel.language, {
        //triggerCharacters: [' '],
        provideCompletionItems: (model, position, context) => {

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

      this.monaco.languages.registerHoverProvider(this.codeModel.language, {
        provideHover: function (model, position) {

          const { column, lineNumber } = position;
          const theWord = model.getWordAtPosition(position);
          if (theWord) {
            const parsed = theWord.word.match(/([0-9]*)([^:]*)/);
            const entry = self.glossary.getAsEntry(parsed[2]);
            console.debug("theWord!", parsed[2]);
            if (entry.isValid) {
              return {
                range: new self.monaco.Range(lineNumber, theWord.startColumn, lineNumber, theWord.endColumn),
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

      this.codeModel.value = this.content;
      this.updateGlossary();
      this.updateSuggestions();
      this.updatePrint();
      this.processAsPDF();

    });
  }

  @HostListener('window:keydown.control.s', ['$event'])
  refresh($event: KeyboardEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    localStorage.setItem("protobg-code", this.codeModel.value);
    this.snackBar.open("saved", undefined, { duration: 1000 });

    if (this.updateGlossary()) {
      this.updateSuggestions();
      this.updatePrint();
      this.processAsPDF();
    }
  }


  private updateGlossary() {
    try {
      const data = readGlossaryFromYaml(this.codeModel.value);
      fixTagsDeclaration(data);
      this.glossary = new Glossary(MetaTags.metadata, Templating.metadata, Pao.metadata, data);
    } catch (exception) {

      this.snackBar.open("fix the glossary", undefined, { duration: 1000 });
      console.error(exception);
      return false;
    }

    return true;
  }

  updatePrint() {
    this.printings = [...this.glossary.search.atLeastOne(Pao.ASSEMBLY, Pao.PRINTING).toList()];
    if (-1 == this.printings.findIndex(x => x.name == this.currentPrinting.name && x.icon == this.currentPrinting.icon)) {
      this.currentPrinting = this.printings.length > 0 ? this.printings[0] : this.defaultPrinting;
    }
  }

  changePrint(print: any) {
    this.currentPrinting = print;
    this.processAsPDF();
  }

  ngOnInit(): void {

  }

  public onTabsChanged(event: MatTabChangeEvent) {

    if (event.index == 1) {
      this.processAsPDF();
    }
    else if (event.index == 2) {
      this.processAsCode();
    }
  }

  private updateSuggestions() {
    this.tagSuggestions = [];
    this.snippetSuggestions = [];
    for (let [index, tag] of Object.entries(this.glossary.glossary)) {

      const entry = new Entry(this.glossary, tag);
      this.tagSuggestions.push({
        _entry: entry,
        label: index,
        filterText: tag.name,
        kind: this.monaco.languages.CompletionItemKind.Keyword,
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
            kind: this.monaco.languages.CompletionItemKind.Snippet,
            insertTextRules: this.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            insertText: insertText.join("\n")
          });
        }
      }
    }
  }

  public processAsPDF() {
    const pao = new PaoContext(this.glossary, new TagExpression(this.glossary));
    this.currentPrinting = this.glossary.get(this.currentPrinting.icon + this.currentPrinting.name);
    const p = pao.entryAsPrinting(this.currentPrinting);
    p.toPdf().then(x => {
      this.pdfSrc = x;
    });
  }

  public processAsCode() {
    const data = readGlossaryFromYaml(this.content);
    fixTagsDeclaration(data);
    this.code = exportAsTypescript(data);
  }

  public pdfSrc: string = "";

  public get pdfSrcSafe() {
    return this.sanitizer.bypassSecurityTrustUrl(this.pdfSrc);
  }

  public code: string = "{}";

  public content: string = `
# example for PAO

## My domain

🧰goods:
  tags: 🏢building

🏭factory:
    title: the factory
    description: amazing factory's description
    tags: 🏢building
    📈produce: 1🧰goods
    📉consume: 10🧱raw
    ⚒️build: 100🧱raw

## printing

📘myDeck:
    tags: 📘document 
    📑foreach:
        - { 📑is: 🏭factory, 🖨️copies: 10}
        - { 📑is: 🧰goods, 🖨️copies: 1}
    ⏹layout: ⏹myLayout
    📐template: 📐debugTemplate
    📐parameters:
      ⬛left: 📉consume
      ⬛right: 📈produce
      ⬛bottom: ⚒️build

⏹myLayout:
  description: accordingly the https://printeurope.fr specification
  tags: ⏹layout
  📄format: 🃏poker 
  🔄orientation: 🔄portrait
  📏paddings: 4📏mm
  📏bleeds: 2📏mm
  📏corners: 4📏mm

🖨️myPrinting: 
  tags: 🖨️printing
  📑foreach: { 📑is: 📘myDeck }
  🖨️mode: 🛑review
  📏density: 300📏dpi
  📏margins: 10📏mm  
  
🖨️myAssembly:
  tags: 🖨️assembly
  📑foreach: { 📑is: 📘myDeck }
  🖨️mode: 🚀production
  📄format: 📄A4
  ➕marks: ➕lines
  🔄orientation: 🔄landscape
  📏margins: 10📏mm 
  📏gutters: 5📏mm 
  📏density: 300📏dpi  

📐debugTemplate:
  tags: 📐nunjucks 
  📐definition: |
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="{{ width }}"
    height="{{ height }}" viewBox="0 0 {{ width }} {{ height }}">
      <g id="bleedLayer" transform="translate({{bleedbox.x}}, {{bleedbox.y}})">
        <rect id="bleedbox" x="0" y="0" width="{{bleedbox.width}}" height="{{bleedbox.height}}" fill="yellow"/>
      </g>
      <g id="trimLayer" transform="translate({{trimbox.x}}, {{trimbox.y}})">
        <rect id="trimbox" x="0" y="0" width="{{trimbox.width}}" height="{{trimbox.height}}" stroke-width="0.1"
            fill="lightgreen" rx="{{trimbox.corners}}" ry="{{trimbox.corners}}" stroke="red"/>
        <text text-anchor="left" alignment-baseline="hanging" x="{{trimbox.corners}}" y="0" font-size="4" fill="red">
            trimbox
        </text>
      </g>
      <g id="artLayer" transform="translate({{artbox.x}}, {{artbox.y}})">
        <rect id="artbox" x="0" y="0" width="{{artbox.width}}" height="{{artbox.height}}" stroke-width="1" fill="green" />
        <text style="font-family: sans-serif;font-size:10" text-anchor="middle" x="{{artbox.width/2}}" y="{{artbox.height/2}}" fill="darkgreen">
            artbox
        </text>
      </g>
    </svg>

📐myCardTemplate:
  tags: 📐nunjucks 
  📐definition: |
    {% set paddings = '📏paddings' | fromParameters | millimeter  %}
    {% set corners = '📏corners' | fromParameters | millimeter %}

    {% set contentCorners = corners /2  %}
    {% set contentWidth = width - (paddings*2)  %}
    {% set contentHeight = height - (paddings*2)  %}
    {% set contentHalfWidth = contentWidth/2  %}
    {% set contentHalfHeight = contentWidth/2  %}
    
    {% set lineHeight = 10  %}
    {% set fontSize = lineHeight-3  %}
    {% set title = 'name' | fromModel %}
    {% set icon = 'icon' | fromModel  %}
    
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="{{ width }}"
    height="{{ height }}" viewBox="0 0 {{ width }} {{ height }}">
      <rect x="0" y="0" width="{{width}}" height="{{height}}" rx="4" ry="4" fill="gray"/>
      <g id="content" class="debug" transform="translate({{paddings}}, {{paddings}})">
        <rect x="0" y="0"  width="{{contentWidth}}" height="{{contentHeight}}" rx="{{contentCorners}}" ry="{{contentCorners}}" fill="red"
    stroke="green" stroke-width="0"/>
        <rect id="title" class="debug" width="{{contentWidth}}" height="{{lineHeight}}" rx="{{contentCorners}}" ry="{{contentCorners}}" fill="green"/>
        <text text-anchor="middle" x="{{contentHalfWidth}}" y="{{fontSize}}" font-size="{{fontSize}}">
            {{icon}}{{title}}
        </text>
      </g>
    </svg>
`
}