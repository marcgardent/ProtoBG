import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { EventHubService } from 'src/app/services/eventhub.service';
import { FileSystemService } from 'src/app/services/file-system.service';
import { GlossaryService } from 'src/app/services/glossary.service';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent implements OnInit {
   
  public selectedIndex: number = 0;
  public readonly codeExport = { icon: '👨‍💻', name: 'Code Typescript' };
  private readonly defaultExports = { icon: '🖨️', name: 'Exports' };
  public currentExport: any = this.defaultExports;
  public bundles = [];
  public bundleResult: any = undefined;
  public download = undefined;
  public code: string = "{}";

  get exports() { return this.bundles.length + 1 }
  private get glossary() { return this.glossaryService.glossary; }

  constructor(private snackBar: MatSnackBar,
    private readonly sanitizer: DomSanitizer,
    private readonly glossaryService: GlossaryService,
    private readonly warehouseService: WarehouseService,
    private readonly hub: EventHubService,
    public readonly fs: FileSystemService) {

    this.hub.onSuccess.subscribe((m) => {
      this.snackBar.open(m, undefined, { duration: 1000 });
    });

    this.hub.onError.subscribe((m) => {
      this.snackBar.open(m, undefined, { duration: 4000 });
    });

    this.glossaryService.currentGlossary.subscribe((g) => {
    });

    this.glossaryService.runtimeError.subscribe((e) => {
    });

    this.glossaryService.reports.subscribe((r) => {
    });
  }

  ngOnInit(): void {

  }

  resize() {
    this.hub.resizeArea.next();
  }

  resizing() {
    this.hub.resizingArea.next();
  }

  @HostListener('window:keydown.control.r', ['$event'])
  refresh($event: KeyboardEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    window.location.reload();  
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
