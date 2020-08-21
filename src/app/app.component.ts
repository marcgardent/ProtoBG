import { Component } from '@angular/core';
import { readGlossaryFromYaml } from './lib/tags/YamlTagLexer';
import { exportAsTypescript } from './lib/tags/TypescriptExporter';
import { fixTagsDeclaration } from './lib/tags/TagParser';
import { Pao } from './lib/pao/pao.tags';
import { GenericCardLayout } from './lib/pao/GenericCardLayout';
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
    const projects = glossary.search.atLeastOne(Pao.DEFAULTCARDLAYOUT).toList();
    const promises = [];
    const preloaded = [];
    
    for (let project of projects) {
      const cards = template.toSvg(project);
      for (let card of cards) {
        const imgUrl = "data:image/svg+xml;utf-8," + card.content;
        const p = loadImage(imgUrl).then((x: HTMLImageElement) => {
          const canvas = document.createElement("canvas") as HTMLCanvasElement;
          canvas.height = 700;
          canvas.width = 500;
          const context = canvas.getContext("2d");
          context.fillStyle = "red";
          context.fillRect(0, 0, 500, 700);
          context.drawImage(x, 0, 0, 500, 700);
          preloaded.push({ canvas: canvas, quantity: card.quantity });
        });
        promises.push(p);
      }
    }

    Promise.all(promises).then(() => {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [50, 70] });
      for (let item of preloaded) {
        for (let i = 0; i < item.quantity; i++) {
          doc.addImage(item.canvas, 0, 0, 50, 70);
          if (i < item.quantity-1) { doc.addPage(); }
        }
      }
      doc.save();
    });

    //context.drawImage(img,0,0,500,700);

    // doc.addHTML(img, 0, 0, 50, 70, "alias");
    // doc.text("hello", 10, 10);
    // doc.addPage();

    //doc.save();
  }


  public processAsCode() {
    const data = readGlossaryFromYaml(this.content);
    fixTagsDeclaration(data);
    this.code = exportAsTypescript(data);
  }

  public code: string = "{}"
  public content: string = `
# example for PAOCard

## My domain

🏭factory:
    title: the factory
    description: amazing factory's description
    tags: 🏢building
    📈produce: 1🧰goods
    📉consume: 10🧱raw
    ⚒️build: 10🧱raw

## Export as cardsheet

⬛myBorders:
    tags: ⬛borders
    📏paddings: 2📏mm
    📏corners: 4📏mm

⬛myCardLayout:
    tags: ⬛defaultCardLayout
    ⬛left: 📉consume
    ⬛right: 📈produce
    ⬛bottom: ⚒️build
    ⬛borders: ⬛myBorders
    🃏card: 🃏poker
    📑for:
        - { 📑is: 🏭factory, 📐instances: 10 }

📄myCardsheet:
  tags: 📄cardsheet
  📑for: { 📑is: ⬛myCardLayout }
  📄page: 📄A4
  🔄orientation: 🔄portrait 
`

}