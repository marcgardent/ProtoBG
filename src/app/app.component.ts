import { Component, OnInit, HostListener } from '@angular/core';
import { readGlossaryFromYaml } from './lib/tags/YamlTagLexer';
import { exportAsTypescript } from './lib/tags/TypescriptExporter';
import { fixTagsDeclaration } from './lib/tags/TagParser';
import { Pao } from './lib/pao/pao.tags';
import { TagExpression } from './lib/tags/TagExpression';
import { PaoContext } from './lib/pao/PaoContext';

import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { MatSnackBar } from '@angular/material/snack-bar';
import { gameIcons } from './lib/gameicons/gameicons';
import { DomSanitizer } from '@angular/platform-browser';

import { EventHubService } from './services/eventhub.service';
import { WarehouseService } from './services/warehouse.service';
import { GlossaryService } from './services/glossary.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  private readonly defaultPrinting = { icon: '🖨️', name: 'Print' };

  public definitions = [];

  public gameIcons = gameIcons;
  public printings = [];
  public currentPrinting: any = this.defaultPrinting;

  private get glossary() { return this.hub.currentGlossary.value; }

  constructor(private snackBar: MatSnackBar,
    private readonly sanitizer: DomSanitizer,
    private readonly glossaryService: GlossaryService,
    private readonly warehouse: WarehouseService,
    private readonly hub: EventHubService) {

    this.hub.onSuccess.subscribe((m) => {
      this.snackBar.open(m, undefined, { duration: 1000 });
    });

    this.hub.onError.subscribe((m) => {
      this.snackBar.open(m, undefined, { duration: 4000 });
    });

    this.hub.currentGlossary.subscribe((g) => {
      this.updatePrint();
      this.processAsPDF();
      this.processAsCode();
    });

  }

  ngOnInit(): void {

  }

  updatePrint() {
    if (this.glossary) {
      this.printings = [...this.glossary.search.atLeastOne(Pao.ASSEMBLING, Pao.PRINTING).toList()];
      if (-1 == this.printings.findIndex(x => x.name == this.currentPrinting.name && x.icon == this.currentPrinting.icon)) {
        this.currentPrinting = this.printings.length > 0 ? this.printings[0] : this.defaultPrinting;
      }
    }
  }

  changePrint(print: any) {
    this.currentPrinting = print;
    this.processAsPDF();
  }

  public onTabsChanged(event: MatTabChangeEvent) {
    // if (event.index == 0) {
    //   this.processAsPDF();
    // }
    // else if (event.index == 1) {
    //   this.processAsCode();
    // }
  }

  public processAsPDF() {

    if (this.glossary) {
      const pao = new PaoContext(this.glossary, new TagExpression(this.glossary));
      this.currentPrinting = this.glossary.get(this.currentPrinting.icon + this.currentPrinting.name);
      if (this.currentPrinting) {
        const p = pao.entryAsPrinting(this.currentPrinting);
        p.toPdf().then(x => {
          this.pdfSrc = x;
        });
      }
      else {
        this.currentPrinting = this.defaultPrinting;
      }
    }
  }

  public processAsCode() {
    const data = readGlossaryFromYaml(this.glossaryService.mergeAll(this.hub.currentWorkspace.value));
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
    tags: 🖼️artworks 
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
