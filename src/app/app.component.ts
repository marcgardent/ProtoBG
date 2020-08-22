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
# example for PAOCard

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

## Export as cardsheet

📐myCardLayout:
    tags: 📐CardLayout
    📑foreach:
        - { 📑is: 🏭factory, 🖨️copies: 1}
        - { 📑is: 🧰goods, 🖨️copies: 1}
    📐template: 📐myDefaultNunjucks
    📐parameters:
      📏paddings: 2📏mm
      📏corners: 4📏mm
      ⬛left: 📉consume
      ⬛right: 📈produce
      ⬛bottom: ⚒️build

🖨️myGrid:
  tags: 🖨️grid
  📑foreach: { 📑is: 📐myCardLayout }
  📄page: 📄A4
  🃏card: 🃏poker
  📏margins: 10📏mm
  🔄orientation: 🔄portrait

🖨️myReview:
  tags: 🖨️review
  🃏card: 🃏poker
  📑foreach: { 📑is: ⬛myCardLayout }

🖨️myFullBleed:
  tags: 🖨️fullBleed
  🃏card: 🃏poker
  📑foreach: { 📑is: ⬛myCardLayout }

`
}