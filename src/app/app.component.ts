import { Component, OnInit, HostListener } from '@angular/core';
import { readGlossaryFromYaml } from './lib/tags/YamlTagLexer';
import { exportAsTypescript } from './lib/tags/TypescriptExporter';
import { fixTagsDeclaration } from './lib/tags/TagParser';
import { PaoTags } from './lib/pao/pao.tags';
import { TagExpression } from './lib/tags/TagExpression';
import { PaoContext } from './lib/pao/PaoContext';

import { MatSnackBar } from '@angular/material/snack-bar';
import { gameIcons } from './lib/gameicons/gameicons';
import { DomSanitizer } from '@angular/platform-browser';

import { EventHubService } from './services/eventhub.service';
import { WarehouseService } from './services/warehouse.service';
import { GlossaryService } from './services/glossary.service';
import { BundleTags } from './lib/bundle/temp';
import { MainContext } from './lib/MainContext';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  public gameIcons = gameIcons;
  public selectedIndex: number = 0;

  public readonly codeExport = { icon: '👨‍💻', name: 'Code Typescript' };
  private readonly defaultExports = { icon: '🖨️', name: 'Exports' };
  public currentExport: any = this.defaultExports;
  public printings = [];
  public bundles = [];
  public bundleResult: any = undefined;
  public download = undefined;
  public pdfSrc: string = "";
  public code: string = "{}";
  public updateCurrent: () => void = () => { this.selectCode() };

  get exports() { return this.printings.length + this.bundles.length + 1 }


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
      this.onGlossaryUpdated();
    });

  }

  ngOnInit(): void {

  }

  animationDone() {
    if (this.selectedIndex == 0) {
      this.updateCurrent();
    }
  }

  onGlossaryUpdated() {
    if (this.glossary) {
      this.printings = [...this.glossary.search.atLeastOne(PaoTags.ASSEMBLING, PaoTags.PRINTING).toList()];
      this.bundles = [...this.glossary.search.atLeastOne(BundleTags.BUNDLE).toList()];
      this.updateCurrent();
    }
  }

  updatePdf() {
    if (-1 == this.printings.findIndex(x => x.name == this.currentExport.name && x.icon == this.currentExport.icon)) {
      if (this.printings.length > 0) {
        this.selectPrint(this.printings[0]);
      }
      else {
        this.selectCode();
      }
    }
    else {
      this.selectPrint(this.currentExport);
    }
  }

  updateBundle() {
    if (-1 == this.bundles.findIndex(x => x.name == this.currentExport.name && x.icon == this.currentExport.icon)) {
      if (this.bundles.length > 0) {
        this.selectBundle(this.bundles[0]);
      }
      else {
        this.selectCode();
      }
    }
    else {
      this.selectBundle(this.currentExport);
    }
  }

  resetSelection() {
    this.currentExport = this.defaultExports;
    this.download = undefined;
    this.pdfSrc = undefined;
    this.code = undefined;
    this.bundleResult = undefined;
  }

  selectPrint(print: any) {
    this.resetSelection();
    this.currentExport = print;
    this.processAsPDF();
    this.setDownload(this.currentExport.name + ".pdf", this.pdfSrc);
    this.updateCurrent = this.updatePdf;
  }

  selectCode() {
    this.resetSelection();
    this.currentExport = this.codeExport;
    this.processAsCode();
    this.setDownload("tags.ts", 'data:text/plain;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(this.code))));
    this.updateCurrent = this.selectCode;
  }

  selectBundle(bundle: any) {
    this.resetSelection();
    this.currentExport = bundle;
    this.updateCurrent = this.updateBundle;
    this.processAsBundle();
  }

  public setDownload(name: string, data: string) {
    this.download = { content: this.sanitizer.bypassSecurityTrustUrl(data), name: name };
  }
  
  private processAsCode() {
    const data = readGlossaryFromYaml(this.glossaryService.mergeAll(this.hub.currentWorkspace.value));
    fixTagsDeclaration(data);
    this.code = exportAsTypescript(data);
  }

  private processAsBundle() {
    if (this.glossary) {
      const ctx = new MainContext(this.glossary, new TagExpression(this.glossary));
      this.currentExport = this.glossary.get(this.currentExport.icon + this.currentExport.name);
      const zipper = ctx.entryAsBundle(this.currentExport);
      if (zipper) {
        zipper.toZip().then((r) => {
          this.bundleResult = { files: r.files, filename: r.filename };
          r.content.then((x) => {
            this.setDownload(r.filename, x);
          });
        });
      }
    }
  }

  private processAsPDF() {

    if (this.glossary) {
      const pao = new PaoContext(this.glossary, new TagExpression(this.glossary));
      this.currentExport = this.glossary.get(this.currentExport.icon + this.currentExport.name);
      if (this.currentExport) {
        const p = pao.entryAsPrinting(this.currentExport);
        p.toPdf().then(x => {
          this.pdfSrc = x;
        });
      }
      else {
        this.currentExport = this.defaultExports;
      }
    }
  }

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
