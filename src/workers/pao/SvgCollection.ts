import { IDocument } from "src/workers/bundle/IDocument";
import { PaoTags } from "src/workers/pao/pao.tags";
import { ILayout, PaoContext } from "src/workers/pao/PaoContext";
import { RawDocument } from "src/workers/templating/RawDocument";


export class SvgCollection extends RawDocument implements IDocument {
    public readonly layout: ILayout;
    constructor(context: PaoContext, documentEntry: any) {
        const layout = context.entryAsLayout(context.reader.mandatoryReferenceAt(documentEntry, PaoTags.LAYOUT));
        super(context.messenger, context.glossary, context.reader, documentEntry, layout);
        this.layout = layout;
    }
}
