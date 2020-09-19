import { PaoTags } from './pao.tags';
import { PaoContext, ILayout } from './PaoContext';
import { RawDocument } from '../templating/RawDocument';
import { IDocument } from "../bundle/IDocument";

export class SvgCollection extends RawDocument implements IDocument {
    public readonly layout: ILayout;
    constructor(context: PaoContext, documentEntry: any) {
        const layout = context.entryAsLayout(context.reader.mandatoryReferenceAt(documentEntry, PaoTags.LAYOUT));
        super(context.glossary, context.reader, documentEntry, layout);
        this.layout = layout;
    }
}


