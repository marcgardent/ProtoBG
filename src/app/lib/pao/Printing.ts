import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { jsPDF } from "jspdf";
import { MetaTags } from '../tags/meta.tags';
import { PrintingDocument } from './PrintingDocument';
import { Pao } from './pao.tags';

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

export class Printing {
    private readonly foreachEntries: any[];
    private readonly mode: any;
    private readonly density: { value: number; unit: any; };

    constructor(private readonly glossary: Glossary, private readonly reader: TagExpression, private readonly printingEntry: any) {
        this.density = reader.quantityOf(reader.mandatoryValueAt(printingEntry, Pao.DENSITY));
        this.mode = reader.mandatoryValueAt(printingEntry, Pao.MODE)
        this.foreachEntries = reader.resolveRequestsAt(
            printingEntry,
            MetaTags.FOREACH
        );
    }

    public toPdf(): Promise<string> {
        const promises = [];
        const images = [];

        for (let docEntry of this.foreachEntries) {
            const doc = new PrintingDocument(this.glossary, this.reader, docEntry.result);

            for (let page of doc.toImages()) {
                const imgUrl = page.content;
                const p = loadImage(imgUrl).then((x: HTMLImageElement) => {
                    const canvas = document.createElement("canvas") as HTMLCanvasElement;

                    // TODO Feat DPI

                    canvas.height = 700;
                    canvas.width = 500;
                    const context = canvas.getContext("2d");
                    context.fillStyle = "red";
                    context.fillRect(0, 0, 500, 700);
                    context.drawImage(x, 0, 0, 500, 700);
                    images.push({ canvas: canvas, quantity: page.quantity });
                });
                promises.push(p);
            }
        }

        return Promise.all(promises).then(() => {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [50, 70] });
            for (let item of images) {
                const quantity = this.mode == Pao.REVIEW ? 1 : item.quantity;

                for (let i = 0; i < quantity; i++) {
                    
                    const page = doc.getCurrentPageInfo();
                    const scale = 72 / 25.4; //mm
                    page.pageContext.trimBox = { bottomLeftX: 10 * scale, bottomLeftY: 10 * scale, topRightX: 40 * scale, topRightY: 60 * scale }
                    page.pageContext.bleedBox = { bottomLeftX: 12 * scale, bottomLeftY: 12 * scale, topRightX: 38 * scale, topRightY: 58 * scale }
                    page.pageContext.artBox = { bottomLeftX: 14 * scale, bottomLeftY: 14 * scale, topRightX: 36 * scale, topRightY: 56 * scale }

                    /*
                    /MediaBox [0 0 198.4251968503937178 283.4645669291338663]
                    /TrimBox [10. 10. 40. 70.]
                    */

                    doc.addImage(item.canvas, 0, 0, 50, 70);
                    doc.addPage();
                }
            }


            doc.deletePage(doc.getNumberOfPages());
            doc.save();
            return doc.output('datauristring');
        });
    }
}
