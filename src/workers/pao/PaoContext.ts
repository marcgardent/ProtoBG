import { IDocument } from "src/workers/bundle/IDocument";
import { IMessenger } from "src/core/report";
import { CanvasCollection } from "src/workers/pao/CanvasCollection";
import { PaoTags } from "src/workers/pao/pao.tags";
import { Assembling } from "src/workers/pao/printing/Assembling";
import { Printing } from "src/workers/pao/printing/Printing";
import { SvgCollection } from "src/workers/pao/SvgCollection";
import { Glossary } from "src/core/glossary/Glossary";
import { ITagContext } from "src/workers/tags/ITagContext";
import { TagExpression } from "src/workers/tags/TagExpression";


export interface IPrinting {
    toPdf(): Promise<string>;
}

export interface ILayout {
    width: number;
    height: number;
    artbox: { x: number, y: number, width: number, height: number };
    bleedbox: { x: number, y: number, width: number, height: number };
    trimbox: { x: number, y: number, width: number, height: number, corners: number };
}

export class PaoContext implements ITagContext {

    constructor(public readonly messenger: IMessenger, public readonly glossary: Glossary, public readonly reader: TagExpression) {

    }

    entryAsLayout(entry: any): ILayout {
        const bleeds = this.reader.asQuantity(this.reader.mandatoryValueAt(entry, PaoTags.BLEEDS)).value;
        const paddings = this.reader.asQuantity(this.reader.mandatoryValueAt(entry, PaoTags.PADDINGS)).value;
        const corners = this.reader.asQuantity(this.reader.mandatoryValueAt(entry, PaoTags.CORNERS)).value;
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


    entryAsPageInfo(entry: any) {
        const format = this.reader.mandatoryReferenceAt(entry, PaoTags.FORMAT);
        const min = this.reader.asQuantity(this.reader.mandatoryValueAt(format, PaoTags.MIN));
        const max = this.reader.asQuantity(this.reader.mandatoryValueAt(format, PaoTags.MAX));
        const orientation = this.reader.mandatoryValueAt(entry, PaoTags.ORIENTATION);

        const width = orientation == PaoTags.LANDSCAPE ? max.value : min.value;
        const height = orientation == PaoTags.LANDSCAPE ? min.value : max.value;

        return { width: width, height: height }; //TODO unit
    }

    entryAsPrinting(printingEntry: any): IPrinting {
        if (this.reader.entryHas(printingEntry, PaoTags.ASSEMBLING)) {
            return new Assembling(this, printingEntry);
        }
        else {
            return new Printing(this, printingEntry);
        }
    }

    entryAsSvgCollection(documentEntry): SvgCollection {
        return new SvgCollection(this, documentEntry);
    }

    entryAsPngCollection(documentEntry): IDocument {
        return new CanvasCollection(this.messenger, documentEntry, this.entryAsSvgCollection(documentEntry), 300);
    }
}