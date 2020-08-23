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
    📄format: 🃏poker 
    🔄orientation: 🔄portrait
    📏margins : 0📏mm
    📐parameters:
      📏paddings: 2📏mm
      📏corners: 4📏mm
      ⬛left: 📉consume
      ⬛right: 📈produce
      ⬛bottom: ⚒️build

🖨️myPrinting: 
  tags: 🖨️printing
  📑foreach: { 📑is: 📘myDeck }
  🖨️mode: 🛑review
  📏density: 300📏dpi  
  
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
    width="{{ page.width }}"
    height="{{ page.height }}" viewBox="0 0 {{ page.width }} {{ page.height }}">
    <rect x="0" y="0" width="{{page.width}}" height="{{page.height}}" fill="red"/>
    <rect x="{{background.x}}" y="{{background.y}}" width="{{background.width}}" height="{{background.height}}" fill="green"/>
    <rect x="{{content.x}}" y="{{content.y}}" width="{{content.width}}" height="{{content.height}}" fill="darkgreen"/>
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