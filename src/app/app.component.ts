import { Component } from '@angular/core';
import { readGlossaryFromYaml } from './lib/tags/YamlTagLexer';
import { exportAsTypescript } from './lib/tags/TypescriptExporter';
import { fixTagsDeclaration } from './lib/tags/TagParser';
import { Pao } from './lib/pao/pao.tags';
import { GenericCardLayout } from './lib/templating/GenericCardLayout';
import { Glossary } from './lib/tags/Glossary';
import { TagExpression } from './lib/tags/TagExpression';
import { jsPDF } from "jspdf";

function loadImage(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.addEventListener('load', e => resolve(img));
    img.addEventListener('error', () => {
      reject(new Error(`Failed to load image's URL: ${url}`));
    });
    img.src = url;
  });
}

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
    const template = new GenericCardLayout(glossary, new TagExpression(glossary));
    const projects = glossary.search.atLeastOne("TODO PRINTING PROJECT").toList();
    const promises = [];
    const images = [];

    for (let project of projects) {
      const cards = template.toSvg(project);
      for (let card of cards) {
        //const imgUrl = "data:image/svg+xml;utf-8," + card.content;
        const imgUrl = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(card.content)));
        const p = loadImage(imgUrl).then((x: HTMLImageElement) => {
          const canvas = document.createElement("canvas") as HTMLCanvasElement;
          canvas.height = 700;
          canvas.width = 500;
          const context = canvas.getContext("2d");
          context.fillStyle = "red";
          context.fillRect(0, 0, 500, 700);
          context.drawImage(x, 0, 0, 500, 700);
          images.push({ canvas: canvas, quantity: card.quantity });
        });
        promises.push(p);
      }
    }

    Promise.all(promises).then(() => {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [50, 70] });
      for (let item of images) {
        for (let i = 0; i < item.quantity; i++) {
          doc.addImage(item.canvas, 0, 0, 50, 70);
          doc.addPage();
        }
      }
      doc.deletePage(doc.getNumberOfPages());
      //doc.save();
      this.pdfSrc =doc.output('datauristring');
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
    📐template: 📐myCardTemplate
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
  
🖨️myAssembly:
  tags: 🖨️assembly
  📑foreach: { 📑is: 📘myDeck }
  🖨️mode: 🚀production
  📄format: 📄A4
  🔄orientation: 🔄portait
  📏margins: 10📏mm 
  📏gunter: 0📏mm 


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