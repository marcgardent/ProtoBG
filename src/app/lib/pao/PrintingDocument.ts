import { MetaTags } from '../tags/meta.tags';
import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { templateFactory, ITemplate } from '../templating/templateFactory';
import { Templating } from '../templating/templating.tag';
import { Pao } from './pao.tags';
import { PaoContext } from './PaoContext';

export class PrintingDocument {
    private readonly template: ITemplate;
    private readonly foreachEntries: any[];
    private readonly parameters: any;
    private readonly layout: any;

    get reader() { return this.context.reader }
    get glossary() { return this.context.glossary }

    constructor(private readonly context: PaoContext, private readonly documentEntry: any) {

        this.parameters = this.reader.mandatoryValueAt(documentEntry, Templating.PARAMETERS);
        this.layout = context.entryAsLayout(this.reader.mandatoryReferenceAt(documentEntry, Pao.LAYOUT));

        console.debug(this.layout);

        const templateEntry = this.reader.mandatoryReferenceAt(documentEntry, Templating.TEMPLATE);
        this.template = templateFactory(this.glossary, this.reader, templateEntry);
        this.foreachEntries = this.reader.resolveRequestsAt(documentEntry, MetaTags.FOREACH);
    }

    public toImages(): {
        content: string;
        copies: number;
        layout: any;
    }[] {
        const ret = new Array();
        for (let source of this.foreachEntries) {
            const content = this.template.apply(this.parameters, this.documentEntry, source.result, this.layout);
            const copies = this.reader.coalesce(parseInt(source.request[Pao.COPIES]), 1);
            ret.push({
                content: "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(content))),
                copies: copies,
                layout: this.layout
            });
        }
        return ret;
    }
}
