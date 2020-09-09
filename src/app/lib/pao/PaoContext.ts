import { TagExpression } from '../tags/TagExpression';
import { Pao } from './pao.tags';
import { Glossary } from '../tags/Glossary';
import { Printing } from './printing/Printing';
import { Assembly } from './printing/Assembly';


export interface IPrinting {
    toPdf(): Promise<string>;
}

export class PaoContext {

    entryAsLayout(entry: any): any {
        const bleeds = this.reader.asQuantity(this.reader.mandatoryValueAt(entry, Pao.BLEEDS)).value;
        const paddings = this.reader.asQuantity(this.reader.mandatoryValueAt(entry, Pao.PADDINGS)).value;
        const corners = this.reader.asQuantity(this.reader.mandatoryValueAt(entry, Pao.CORNERS)).value;
        const { width, height } = this.entryAsPageInfo(entry);

        return {
            width: width + bleeds * 2,
            height: height + bleeds * 2,
            artbox: {
                x: bleeds + paddings,
                y: bleeds + paddings,
                width: width - paddings * 2,
                height: height - paddings * 2,
            },
            bleedbox: {
                x: 0,
                y: 0,
                width: width + bleeds * 2,
                height: height + bleeds * 2,
            },
            trimbox: {
                x: bleeds,
                y: bleeds,
                width: width,
                height: height,
                corners: corners
            }
        }
    }

    constructor(public readonly glossary: Glossary, public readonly reader: TagExpression) {

    }

    entryAsPageInfo(entry: any) {
        const format = this.reader.mandatoryReferenceAt(entry, Pao.FORMAT);
        const min = this.reader.asQuantity(this.reader.mandatoryValueAt(format, Pao.MIN));
        const max = this.reader.asQuantity(this.reader.mandatoryValueAt(format, Pao.MAX));
        const orientation = this.reader.mandatoryValueAt(entry, Pao.ORIENTATION);

        const width = orientation == Pao.LANDSCAPE ? max.value : min.value;
        const height = orientation == Pao.LANDSCAPE ? min.value : max.value;

        return { width: width, height: height }; //TODO unit
    }

    entryAsPrinting(printingEntry: any): IPrinting {
        if (this.reader.entryHas(printingEntry, Pao.ASSEMBLING)) {
            return new Assembly(this, printingEntry);
        }
        else {
            return new Printing(this, printingEntry);
        }
    }
}



