
import { jsPDF } from "jspdf";
import { MetaTags } from '../../tags/meta.tags';
import { PrintingDocument } from '../PrintingDocument';
import { Pao } from '../pao.tags';
import { PaoContext, IPrinting } from '../PaoContext';


export class Printing implements IPrinting {
    private readonly foreachEntries: any[];
    private readonly mode: any;
    private readonly density: { value: number; unit: any; };
    private readonly margins: { value: number; unit: any; };

    get reader() { return this.context.reader }
    get glossary() { return this.context.glossary }

    constructor(private readonly context: PaoContext, private readonly printingEntry: any) {
        this.margins = this.reader.quantityOf(this.reader.mandatoryValueAt(printingEntry, Pao.MARGINS));
        this.density = this.reader.quantityOf(this.reader.mandatoryValueAt(printingEntry, Pao.DENSITY));
        this.mode = this.reader.mandatoryValueAt(printingEntry, Pao.MODE);
        this.foreachEntries = this.reader.resolveRequestsAt(
            printingEntry,
            MetaTags.FOREACH
        );
    }

    public toCanvas(): { ready: Promise<any>, images: Array<{ canvas: HTMLCanvasElement, copies: number, layout: any }> } {
        const promises = [];
        const images = [];

        for (let docEntry of this.foreachEntries) {
            const doc = new PrintingDocument(this.context, docEntry.result);

            for (let page of doc.toImages()) {
                const imgUrl = page.content;
                const p = this.loadImage(imgUrl).then((x: HTMLImageElement) => {
                    const canvas = document.createElement("canvas") as HTMLCanvasElement;
                    canvas.height = page.layout.height / 25.4 * this.density.value; // TODO unit
                    canvas.width = page.layout.width / 25.4 * this.density.value; // TODO unit
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

    public *enumerateCopies(images) {
        for (let item of images) {
            const copies = this.mode == Pao.REVIEW ? 1 : item.copies;
            for (let i = 0; i < copies; i++) {
                yield {
                    layout: item.layout,
                    canvas: item.canvas
                }
            }
        }
    }

    public toPdf(): Promise<string> {
        const canvas = this.toCanvas();
        const images = canvas.images;
        return canvas.ready.then(() => {
            const doc = new jsPDF({ unit: 'mm' });

            for (let item of this.enumerateCopies(images)) {

                const width = item.layout.width + this.margins.value * 2;
                const height = item.layout.height + this.margins.value * 2;

                doc.addPage([width, height]);
                const page = doc.getCurrentPageInfo();

                const scale = 72 / 25.4; //mm TODO unit system
                page.pageContext.bleedBox = this.box(item.layout.bleedbox, scale);
                page.pageContext.trimBox = this.box(item.layout.trimbox, scale);
                page.pageContext.artBox = this.box(item.layout.artbox, scale);

                this.drawTrimLines(doc, item.canvas, this.margins.value, item.layout.trimbox, this.margins.value, this.margins.value, item.layout.width, item.layout.height);
                doc.addImage(item.canvas, this.margins.value, this.margins.value, item.layout.width, item.layout.height)
            }

            doc.deletePage(1);
            return doc.output('datauristring');
        });
    }


    loadImage(url) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            let img = new Image();
            img.addEventListener('load', e => resolve(img));
            img.addEventListener('error', () => {
                reject(new Error(`Failed to load image's URL: ${url}`));
            });
            img.src = url;
        });
    }

    drawTrimLines(doc: jsPDF, image: HTMLCanvasElement, trimSize: number, trimbox: any, x: number, y: number, width: number, height: number) {
        {
            const trimWidth = 0.5;//TODO Model with Default value
            doc.setLineWidth(trimWidth);

            const v1 = x + trimbox.x;
            const v2 = x + trimbox.x + trimbox.width;
            const h1 = y + trimbox.y;
            const h2 = y + trimbox.x + trimbox.height;

            doc.line(v1, y - trimSize, v1, y + height + trimSize);
            doc.line(v2, y - trimSize, v2, y + height + trimSize);

            doc.line(x - trimSize, h1, x + width + trimSize, h1);
            doc.line(x - trimSize, h2, x + width + trimSize, h2);

            doc.setFillColor(255, 255, 0);

            //doc.rect(x, y, width, height, 'F');
        }

    }
}
