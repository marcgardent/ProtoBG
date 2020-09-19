import { PaoTags } from '../pao.tags';
import { PaoContext, IPrinting } from '../PaoContext';
import { Printing } from './Printing';
import jsPDF from 'jspdf';

export class Assembling implements IPrinting {
    private readonly gutters: { value: number; unit: any; };
    private readonly printing: Printing;
    private readonly page: { width: number; height: number; };
    private readonly margins: { value: number; unit: any; };
    private readonly marks: any;

    get reader() { return this.context.reader; }
    get glossary() { return this.context.glossary; }

    constructor(private readonly context: PaoContext, private readonly printingEntry: any) {
        this.page = this.context.entryAsPageInfo(printingEntry);
        this.margins = this.reader.asQuantity(this.reader.mandatoryValueAt(printingEntry, PaoTags.MARGINS));
        this.gutters = this.reader.asQuantity(this.reader.mandatoryValueAt(printingEntry, PaoTags.GUTTERS));
        this.marks = this.reader.mandatoryValueAt(printingEntry, PaoTags.MARKS);
        this.printing = new Printing(this.context, this.printingEntry);
    }

    private assemble(images) {
        const pages = [];

        if (images.length > 0) {
            const layout = images[0].layout; // TODO check all layout

            const width = this.page.width - this.margins.value * 2;
            const height = this.page.height - this.margins.value * 2;
            const xmin = this.margins.value;
            const ymin = this.margins.value;
            const xmax = this.margins.value + width;
            const ymax = this.margins.value + height;
            const xstep = layout.width;
            const ystep = layout.height;

            let x = xmin - this.gutters.value;
            let y = ymin;
            let artworks = [];

            for (let item of this.printing.enumerateCopies(images)) {
                // new row ?
                if (x + xstep > xmax) {
                    x = xmin;
                    y += ystep + this.gutters.value;
                    // new page?
                    if (y + ystep > ymax) {
                        x = xmin;
                        y = ymin;
                        pages.push(artworks);
                        artworks = [];
                    }
                }
                else {
                    x += this.gutters.value;
                }

                artworks.push({
                    x: x,
                    y: y,
                    item: item,
                    layout: layout,
                });
                x += xstep;
            }

            if(artworks.length){
                pages.push(artworks);
            }
        }
        
        return pages;
    }

    public toPdf(): Promise<string> {
        const { ready, images } = this.printing.toCanvas();

        const markCanvas = document.createElement("canvas") as HTMLCanvasElement;

        const markReady = this.printing.loadImage("./assets/trim-mark-diy.svg").then((markImg) => {
            markCanvas.height = 256; // 10 / 25.4 * 600; //this.density.value; // TODO unit
            markCanvas.width = 256; // 10 / 25.4 * 600; //this.density.value; // TODO unit
            const context = markCanvas.getContext("2d");
            context.drawImage(markImg, 0, 0, markCanvas.width, markCanvas.height);
            return markCanvas;
        });
        
        return Promise.all([ready, markReady]).then(() => {
            const markPng = markCanvas.toDataURL('image/PNG');
            const doc = new jsPDF({
                format: [this.page.width, this.page.height], unit: "mm",
                orientation: this.page.width > this.page.height ? "landscape" : "portrait"
            });

            for (let pages of this.assemble(images)) {

                doc.addPage();

                //lines trim marks
                if (this.marks == PaoTags.LINES) {
                    for (let artwork of pages) {
                        const { item, layout, x, y } = artwork;
                        this.printing.drawTrimLines(doc, item.canvas, this.gutters.value, layout.trimbox, x, y, item.layout.width, item.layout.height);
                    }
                }

                //artwork
                for (let artwork of pages) {
                    const { item, layout, x, y } = artwork;
                    doc.addImage(item.canvas, x, y, item.layout.width, item.layout.height);
                }

                //corners trim marks
                if (this.marks == PaoTags.CROSS) {
                    for (let artwork of pages) {
                        const { item, layout, x, y } = artwork;
                        this.addMarks(doc, markPng, x + layout.trimbox.x, y + layout.trimbox.y, layout.trimbox.corners);
                        this.addMarks(doc, markPng, x + layout.trimbox.x + layout.trimbox.width, y + layout.trimbox.y, layout.trimbox.corners);
                        this.addMarks(doc, markPng, x + layout.trimbox.x, y + layout.trimbox.y + layout.trimbox.height, layout.trimbox.corners);
                        this.addMarks(doc, markPng, x + layout.trimbox.x + layout.trimbox.width, y + layout.trimbox.y + layout.trimbox.height, layout.trimbox.corners);
                    }
                }
            }
            doc.deletePage(1);
            return doc.output('datauristring');
        });
    }

    private addMarks(doc: jsPDF, mark: string, x, y, radius) {
        doc.addImage(mark, x - radius, y - radius, radius * 2, radius * 2, "mark");
    }
}
