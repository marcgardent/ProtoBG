import { Pao } from '../pao.tags';
import { PaoContext, IPrinting } from '../PaoContext';
import { Printing } from './Printing';
import jsPDF from 'jspdf';

export class Assembly implements IPrinting {
    private readonly gutters: { value: number; unit: any; };
    private readonly printing: Printing;
    private readonly page: { width: number; height: number; };
    private readonly margins: { value: number; unit: any; };

    get reader() { return this.context.reader; }
    get glossary() { return this.context.glossary; }

    constructor(private readonly context: PaoContext, private readonly printingEntry: any) {
        this.page = this.context.entryAsPageInfo(printingEntry);
        this.margins = this.reader.quantityOf(this.reader.mandatoryValueAt(printingEntry, Pao.MARGINS));
        this.gutters = this.reader.quantityOf(this.reader.mandatoryValueAt(printingEntry, Pao.GUTTERS));
        this.printing = new Printing(this.context, this.printingEntry);
    }

    public toPdf(): Promise<string> {
        const { ready, images } = this.printing.toCanvas();
        return ready.then(() => {
            const doc = new jsPDF({ format: [this.page.width, this.page.height], unit: "mm" });
            const x = this.margins.value;
            const y = this.margins.value;
            const width = this.page.width - this.margins.value * 2;
            const height = this.page.height - this.margins.value * 2;

            if (images.length > 0) {
                const layout = images[0].layout;
                // TODO check all layout

                if (layout.width <= width && layout.height <= height) {
                    const xmin = this.margins.value;
                    const ymin = this.margins.value;
                    const xmax = this.margins.value + width;
                    const ymax = this.margins.value + height;
                    const xstep = layout.width;
                    const ystep = layout.height;
                    let x = xmin;
                    let y = ymin;

                    for (let item of this.printing.enumerateCopies(images)) {
                        // new row
                        if (x + xstep > xmax) {
                            x = xmin;
                            y += ystep;
                        }

                        // new page
                        if (y + ystep > ymax) {
                            x = xmin;
                            y = ymin;
                            doc.addPage([this.page.width, this.page.height])
                        }
                        doc.addImage(item.canvas, x, y, layout.width, layout.height);
                        x += xstep;
                    }
                }
                else {
                    console.error("document is too large for the printing", layout, this.page);
                }
            }

            doc.save();
            return doc.output('datauristring');
        });
    }
}
