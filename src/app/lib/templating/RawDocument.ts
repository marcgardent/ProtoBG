import { MetaTags } from '../tags/meta.tags';
import { templateFactory, ITemplate } from './templateFactory';
import { Templating } from './templating.tag';
import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { IDocument } from '../bundle/temp';

export class RawDocument implements IDocument {
    private readonly template: ITemplate;
    private readonly foreachEntries: any[];
    private readonly parameters: any;

    constructor(
        private readonly glossary: Glossary,
        private readonly reader: TagExpression,
        private readonly documentEntry: any,
        private readonly type: string,
        private readonly locals : any) {
        this.parameters = this.reader.mandatoryValueAt(documentEntry, Templating.PARAMETERS);
        const templateEntry = this.reader.mandatoryReferenceAt(documentEntry, Templating.TEMPLATE);
        this.template = templateFactory(this.glossary, this.reader, templateEntry);
        this.foreachEntries = this.reader.resolveRequestsAt(documentEntry, MetaTags.FOREACH);
    }

    public toRaw() {
        const ret = new Array();
        for (let source of this.foreachEntries) {

            const content = this.template.apply(this.parameters, this.documentEntry, source.result, this.locals);
            ret.push({
                content: content,
                context: source.request,
                model: source.result,
                type: this.type,
                base64: false
            });
        }
        return ret;
    }
 
 
}