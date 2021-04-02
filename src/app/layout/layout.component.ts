import { Component, OnInit, HostListener } from '@angular/core';
import { readGlossaryFromYaml } from '../lib/tags/YamlTagLexer';
import { exportAsTypescript } from '../lib/tags/TypescriptExporter';
import { fixTagsDeclaration } from '../lib/tags/TagParser';
import { PaoTags } from '../lib/pao/pao.tags';
import { TagExpression } from '../lib/tags/TagExpression';
import { PaoContext } from '../lib/pao/PaoContext';

import { MatSnackBar } from '@angular/material/snack-bar';
import { gameIcons } from '../lib/gameicons/gameicons';
import { DomSanitizer } from '@angular/platform-browser';

import { EventHubService } from '../services/eventhub.service';
import { WarehouseService } from '../services/warehouse.service';
import { GlossaryService } from '../services/glossary.service';
import { BundleTags } from '../lib/bundle/Bundle.tags';
import { MainContext } from '../lib/MainContext';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {

  public gameIcons = gameIcons;
  public selectedIndex: number = 0;

  public readonly codeExport = { icon: '👨‍💻', name: 'Code Typescript' };
  private readonly defaultExports = { icon: '🖨️', name: 'Exports' };
  public currentExport: any = this.defaultExports;
  public printings = [];
  public bundles = [];
  public pdfSrc: string = undefined;
  public bundleResult: any = undefined;
  public download = undefined;
  public code: string = "{}";
  public updateCurrent: () => void = () => { this.selectCode() };

  public get reports() { return this.glossaryService.reports; }

  public get runtimeErrors() { return this.glossaryService.runtimeErrors; }

  get exports() { return this.printings.length + this.bundles.length + 1 }
  private get glossary() { return this.glossaryService.glossary; }

  constructor(private snackBar: MatSnackBar,
    private readonly sanitizer: DomSanitizer,
    private readonly glossaryService: GlossaryService,
    private readonly warehouseService: WarehouseService,
    private readonly hub: EventHubService) {

    this.hub.onSuccess.subscribe((m) => {
      this.snackBar.open(m, undefined, { duration: 1000 });
    });

    this.hub.onError.subscribe((m) => {
      this.snackBar.open(m, undefined, { duration: 4000 });
    });

    this.glossaryService.currentGlossary.subscribe((g) => {
      this.onGlossaryUpdated();
    });

    this.glossaryService.runtimeError.subscribe((e) => {
      this.selectedIndex = 1;
    });

    this.glossaryService.reports.subscribe((r) => {
      this.selectedIndex = 1;
    });
  }

  ngOnInit(): void {

  }

  animationDone() {
    if (this.selectedIndex == 0) {
      this.updateCurrentWrapper();
    }
  }

  onGlossaryUpdated() {
    if (this.glossary) {
      this.printings = [...this.glossary.search.atLeastOne(PaoTags.ASSEMBLING, PaoTags.PRINTING).toList()];
      this.bundles = [...this.glossary.search.atLeastOne(BundleTags.BUNDLE).toList()];
      this.updateCurrentWrapper();
    }
  }

  updateCurrentWrapper() {
    this.glossaryService.clearRuntimeErrors();
    this.updateCurrent();
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
    this.code = undefined;
    this.bundleResult = undefined;
    this.pdfSrc = undefined;
  }

  selectPrint(print: any) {
    this.resetSelection();
    this.currentExport = print;
    this.processAsPDF();
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

  public safe(data: string) {
    return this.sanitizer.bypassSecurityTrustUrl(data);
  }

  private processAsCode() {
    const data = readGlossaryFromYaml(this.glossaryService.mergeAll(this.warehouseService.workspace));
    fixTagsDeclaration(data);
    this.code = exportAsTypescript(data);
  }

  private processAsBundle() {
    if (this.glossary) {
      const ctx = new MainContext(this.glossaryService, this.glossary, new TagExpression(this.glossaryService, this.glossary));
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
      const pao = new PaoContext(this.glossaryService, this.glossary, new TagExpression(this.glossaryService, this.glossary));
      this.currentExport = this.glossary.get(this.currentExport.icon + this.currentExport.name);
      if (this.currentExport) {
        const p = pao.entryAsPrinting(this.currentExport);
        p.toPdf().then(x => {
          this.pdfSrc = x;
          this.setDownload(this.currentExport.name + ".pdf", x);
        });
      }
      else {
        this.currentExport = this.defaultExports;
      }
    }
  }

  public content: string = `
📐myTemplate:
  tags: 📐nunjucks
  📐extension: svg
  📐definition: |
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="{{ width }}"
    height="{{ height }}" viewBox="0 0 {{ width }} {{ height }}" >
     <style>
        /* <![CDATA[ */
        @font-face {
            font-family: "game-icons";
            src: url('{{ '../assets/game-icons.woff' | includeAsDataUri }}') format('woff');
        }
        /* ]]> */
      </style>
      <g id="bleedLayer" transform="translate({{bleedbox.x}}, {{bleedbox.y}})">
        <rect fill="black" id="bleedbox" x="0" y="0" width="{{bleedbox.width}}" height="{{bleedbox.height}}"/>
      </g>
      <g id="trimLayer" transform="translate({{trimbox.x}}, {{trimbox.y}})">
        <rect id="trimbox" x="0" y="0" width="{{trimbox.width}}" height="{{trimbox.height}}"
            fill="black" rx="{{trimbox.corners}}" ry="{{trimbox.corners}}"/>
      </g>
      <g id="artLayer" transform="translate({{artbox.x}}, {{artbox.y}})">
        <rect id="artbox" x="0" y="0" width="{{artbox.width}}" height="{{artbox.height}}"
        rx="{{trimbox.corners}}" ry="{{trimbox.corners}}" fill="lightgray" />
        <text style="font-family: game-icons;font-size:15" x="{{artbox.width/2}}" y="{{artbox.height/2}}" text-anchor="middle">
            {{ 'icon' | fromModel }}
        </text>
        <text style="font: small-caps bold 8px sans-serif" x="{{artbox.width/2}}" y="{{artbox.height/2+12}}" text-anchor="middle" fill="black">
            {{ 'title' | fromModel }}
        </text>
      </g>
    </svg>

🏠myCard:
  title: my emoji

myGlyph:
    title: my game icon

🖨️myPrinting:
  tags: 🖨️printing
  📑foreach:
    - { 📑is: 🖼️myCollection}
  🖨️mode: 🚀production
  📏margins: 0📏mm
  📏density: 300📏dpi
  
🖼️myCollection:
  tags: 🖼️collection
  ⏹layout: ⏹myLayout
  📐template: 📐myTemplate
  📐parameters: {}
  📑foreach:
    - { 📑is: 🏠myCard, 🖨️copies: 1 }
    - { 📑is: myGlyph, 🖨️copies: 3}

⏹myLayout: 
  tags: ⏹layout
  📄format: 🃏poker 
  🔄orientation: 🔄portrait
  📏paddings: 4📏mm
  📏bleeds: 0📏mm
  📏corners: 4📏mm
`
}
