import { Pao } from './pao.tags';
import { PaoContext } from './PaoContext';
import { RawDocument } from '../templating/RawDocument';
import { IDocument } from '../bundle/temp';

export class SvgCollection extends RawDocument implements IDocument {
    public readonly layout: any;

    constructor(context: PaoContext, documentEntry: any) {
        super(context.glossary, context.reader, documentEntry);
        this.layout = context.entryAsLayout(context.reader.mandatoryReferenceAt(documentEntry, Pao.LAYOUT));
    }

    protected local() {
        return this.layout;
    }
}



