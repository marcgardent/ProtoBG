import { Component, OnInit, HostListener } from '@angular/core';
import { readGlossaryFromYaml } from './lib/tags/YamlTagLexer';
import { exportAsTypescript } from './lib/tags/TypescriptExporter';
import { fixTagsDeclaration } from './lib/tags/TagParser';
import { Pao } from './lib/pao/pao.tags';
import { Glossary } from './lib/tags/Glossary';
import { TagExpression } from './lib/tags/TagExpression';
import { PaoContext } from './lib/pao/PaoContext';
import { CodeModel } from '@ngstack/code-editor';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { MatSnackBar } from '@angular/material/snack-bar';
import { gameIcons } from './lib/gameicons/gameicons';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  public gameIcons = gameIcons;

  constructor(private snackBar: MatSnackBar, private readonly sanitizer: DomSanitizer) {
    const txt = localStorage.getItem("protobg-code");
    if (txt) {
      this.content = txt;
    }
    console.debug(this.gameIcons)
  }

  public printings = [];
  private readonly defaultPrinting = { icon: '🖨️', name: 'Print' };
  public currentPrinting: any = this.defaultPrinting;

  onCodeChanged(): any {

  }

  updatePrint() {
    const data = readGlossaryFromYaml(this.codeModel.value);
    fixTagsDeclaration(data);
    const glossary = new Glossary(Pao.metadata, data);
    this.printings = [...glossary.search.atLeastOne(Pao.ASSEMBLY, Pao.PRINTING).toList()];
    if (-1 == this.printings.findIndex(x => x.name == this.currentPrinting.name && x.icon == this.currentPrinting.icon)) {
      this.currentPrinting = this.printings.length > 0 ? this.printings[0] : this.defaultPrinting;
    }
  }

  @HostListener('window:keydown.control.s', ['$event'])
  refresh($event: KeyboardEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    localStorage.setItem("protobg-code", this.codeModel.value);
    this.snackBar.open("saved", undefined, { duration: 1000 });
    this.updatePrint();
    this.processAsSvg();
  }
  changePrint(print: any) {
    this.currentPrinting = print;
    this.processAsSvg();
  }

  ngOnInit(): void {
    this.codeModel.value = this.content;
    this.updatePrint();
    this.processAsSvg();
  }

  theme = 'vs';

  codeModel: CodeModel = {
    language: 'markdown',
    uri: 'printing.md',
    value: 'content',
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
    fontFamily: "game-icons, monospace"
  };

  public definitions = [];

  public onTabsChanged(event: MatTabChangeEvent) {


    if (event.index == 1) {
      this.processAsSvg();
    }
    else if (event.index == 2) {
      this.processAsCode();
    }

  }

  public processAsSvg() {

    const data = readGlossaryFromYaml(this.codeModel.value);
    fixTagsDeclaration(data);
    const glossary = new Glossary(Pao.metadata, data);
    const pao = new PaoContext(glossary, new TagExpression(glossary));
    this.currentPrinting = glossary.get(this.currentPrinting.icon + this.currentPrinting.name);
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