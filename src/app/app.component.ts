import { Component } from '@angular/core';
import { readGlossaryFromYaml } from './lib/tags/YamlTagLexer';
import { exportAsTypescript } from './lib/tags/TypescriptExporter';
import { fixTagsDeclaration } from './lib/tags/TagParser';
import { Pao } from './lib/pao/pao.tags';
import { Glossary } from './lib/tags/Glossary';
import { TagExpression } from './lib/tags/TagExpression';
import { printingFactory } from './lib/pao/printingFactory';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public definitions = [];

  public processAsSvg() {
    const data = readGlossaryFromYaml(this.content);
    fixTagsDeclaration(data);
    const glossary = new Glossary(Pao.metadata, data);
    const printing = glossary.get("🖨️myPrinting");
    const p = printingFactory(glossary, new TagExpression(glossary), printing);
    
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
        - { 📑is: 🏭factory, 🖨️copies: 1}
        - { 📑is: 🧰goods, 🖨️copies: 1}
    📐template: 📐debugTemplate
    📐parameters:
      font: 10
      ⬛left: 📉consume
      ⬛right: 📈produce
      ⬛bottom: ⚒️build
    📄format: 🃏poker 
    🔄orientation: 🔄portrait
    📏paddings: 10📏mm
    📏bleeds: 5📏mm
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
  🔄orientation: 🔄portait
  📏margins: 10📏mm 
  📏gunter: 0📏mm 
  📏density: 300📏dpi  

📐debugTemplate:
  tags: 📐nunjucks 
  📐definition: |
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="{{ mediabox.width }}"
    height="{{ mediabox.height }}" viewBox="0 0 {{ mediabox.width }} {{ mediabox.height }}">
      <g id="bleedLayer" transform="translate({{bleedbox.x}}, {{bleedbox.y}})">
        <rect id="bleedbox" x="0" y="0" width="{{bleedbox.width}}" height="{{bleedbox.height}}" fill="lightgreen"/>
      </g>
      <g id="trimLayer" transform="translate({{trimbox.x}}, {{trimbox.y}})">
        <rect id="trimbox" x="0" y="0" width="{{trimbox.width}}" height="{{trimbox.height}}" stroke-width="0.1"
            fill="transparent" rx="{{trimbox.corners}}" ry="{{trimbox.corners}}" stroke="red"/>
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
    width="{{ mediabox.width }}"
    height="{{ mediabox.height }}" viewBox="0 0 {{ mediabox.width }} {{ mediabox.height }}">
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