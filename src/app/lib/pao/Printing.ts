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

    public toCanvas(): { ready: Promise<any>, images: Array<{ canvas: HTMLCanvasElement, copies: number, layout: any }> } {

        const promises = [];
        const images = [];

        for (let docEntry of this.foreachEntries) {
            const doc = new PrintingDocument(this.glossary, this.reader, docEntry.result);

            for (let page of doc.toImages()) {
                const imgUrl = page.content;
                const p = loadImage(imgUrl).then((x: HTMLImageElement) => {
                    const canvas = document.createElement("canvas") as HTMLCanvasElement;
                    canvas.height = page.layout.mediabox.height / 25.4 * this.density.value; // TODO unit
                    canvas.width = page.layout.mediabox.width / 25.4 * this.density.value; // TODO unit
                    const context = canvas.getContext("2d");

                    //context.fillStyle = "red";
                    //context.fillRect(0, 0, canvas.width, canvas.height);

                    context.drawImage(x, 0, 0, canvas.width, canvas.height);
                    images.push({
                        canvas: canvas,
                        copies: page.copies,
                        layout: page.layout
                    });
                });
                promises.push(p);
            }
        }
        return {
            ready: Promise.all(promises),
            images: images
        }
    }

    private box(box: any, scale: number) {
        return {
            bottomLeftX: box.x * scale,
            bottomLeftY: box.y * scale,
            topRightX: (box.x + box.width) * scale,
            topRightY: (box.x + box.height) * scale
        }
    }

    public toPdf(): Promise<string> {
        const canvas = this.toCanvas();
        const images = canvas.images;
        return canvas.ready.then(() => {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [10, 10] });
            for (let item of images) {
                const copies = this.mode == Pao.REVIEW ? 1 : item.copies;
                for (let i = 0; i < copies; i++) {
                    doc.addPage(
                        [
                            item.layout.mediabox.width + this.margins.value * 2,
                            item.layout.mediabox.height + this.margins.value * 2
                        ], 'portrait');
                    const page = doc.getCurrentPageInfo();

                    const scale = 72 / 25.4; //mm TODO unit system
                    page.pageContext.bleedBox = this.box(item.layout.bleedbox, scale);
                    page.pageContext.trimBox = this.box(item.layout.trimbox, scale);
                    page.pageContext.artBox = this.box(item.layout.artbox, scale);
                    doc.addImage(item.canvas, this.margins.value, this.margins.value, item.layout.mediabox.width, item.layout.mediabox.height);
                }
            }

            doc.deletePage(1);
            return doc.output('datauristring');
        });
    }
}
