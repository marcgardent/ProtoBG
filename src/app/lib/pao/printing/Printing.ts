
import { jsPDF } from "jspdf";
import { MetaTags } from '../../tags/meta.tags';
import { SvgCollection } from '../SvgCollection';
import { PaoTags } from '../pao.tags';
import { PaoContext, IPrinting } from '../PaoContext';
import { CanvasCollection } from '../CanvasCollection';
import { IDocument } from "../../bundle/IDocument";


export class Printing implements IPrinting, IDocument {
    private readonly foreachEntries: any[];
    private readonly mode: any;
    private readonly density: { value: number; unit: any; };
    private readonly margins: { value: number; unit: any; };

    get reader() { return this.context.reader }
    get glossary() { return this.context.glossary }

    constructor(private readonly context: PaoContext, private readonly printingEntry: any) {

        this.margins = this.reader.asQuantity(this.reader.mandatoryValueAt(printingEntry, PaoTags.MARGINS));
        this.density = this.reader.asQuantity(this.reader.mandatoryValueAt(printingEntry, PaoTags.DENSITY));
        this.mode = this.reader.mandatoryValueAt(printingEntry, PaoTags.MODE);

        this.foreachEntries = this.reader.resolveRequestsAt(
            printingEntry,
            MetaTags.FOREACH
        );
    }

    toRaw(): { content: Promise<string>; type: string; base64: boolean; context: any; model: any; }[] {

        const ret = [];
        for (let docEntry of this.foreachEntries) {
            const doc = <IDocument>new CanvasCollection(new SvgCollection(this.context, docEntry.result), this.density.value); // TODO unit
            ret.push(...doc.toRaw());
        }
        return ret;
    }

    public toCanvas(): { ready: Promise<any>, images: Array<{ canvas: HTMLCanvasElement, copies: number, layout: any }> } {
        const promises = [];
        const images = [];
        for (let docEntry of this.foreachEntries) {
            const doc = new CanvasCollection(new SvgCollection(this.context, docEntry.result), this.density.value); // TODO unit

            for (let page of doc.toHTMLCanvasElement()) {
                const copies = this.reader.coalesce(parseInt(page.context[PaoTags.COPIES]), 1);
                const p = page.content.then(canvas => {
                    images.push({
                        canvas: canvas,
                        copies: copies,
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
            const copies = this.mode == PaoTags.REVIEW ? 1 : item.copies;
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

                doc.addPage([width, height], width > height ? "landscape" : "portrait");
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
