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
    private readonly margins: { value: number; unit: any; };

    constructor(private readonly glossary: Glossary, private readonly reader: TagExpression, private readonly printingEntry: any) {
        this.margins = reader.quantityOf(reader.mandatoryValueAt(printingEntry, Pao.MARGINS));
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

                    canvas.height = page.height / 25.4 * this.density.value; // TODO unit
                    canvas.width = page.width / 25.4 * this.density.value; // TODO unit

                    const context = canvas.getContext("2d");
                    context.fillStyle = "red";
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(x, 0, 0, canvas.width, canvas.height);
                    images.push({
                        canvas: canvas,
                        copies: page.copies,
                        width: page.width,
                        height: page.height,
                    });
                });
                promises.push(p);
            }
        }

        return Promise.all(promises).then(() => {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [10, 10] });
            for (let item of images) {
                const copies = this.mode == Pao.REVIEW ? 1 : item.copies;

                for (let i = 0; i < copies; i++) {
                    doc.addPage([item.width + this.margins.value * 2, item.height + this.margins.value * 2], 'portrait');
                    const page = doc.getCurrentPageInfo();
                    // const scale = 72 / 25.4; //mm
                    // page.pageContext.trimBox = { bottomLeftX: 10 * scale, bottomLeftY: 10 * scale, topRightX: 40 * scale, topRightY: 60 * scale }
                    // page.pageContext.bleedBox = { bottomLeftX: 12 * scale, bottomLeftY: 12 * scale, topRightX: 38 * scale, topRightY: 58 * scale }
                    // page.pageContext.artBox = { bottomLeftX: 14 * scale, bottomLeftY: 14 * scale, topRightX: 36 * scale, topRightY: 56 * scale }
                    
                    doc.addImage(item.canvas, this.margins.value, this.margins.value, item.width, item.height);

                }
            }
            
            doc.deletePage(1);
            //doc.save();
            return doc.output('datauristring');
        });
    }
}
