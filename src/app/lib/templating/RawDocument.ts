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

    constructor(private readonly glossary: Glossary, private readonly reader: TagExpression,  private readonly documentEntry: any) {
        this.parameters = this.reader.mandatoryValueAt(documentEntry, Templating.PARAMETERS);
        const templateEntry = this.reader.mandatoryReferenceAt(documentEntry, Templating.TEMPLATE);
        this.template = templateFactory(this.glossary, this.reader, templateEntry);
        this.foreachEntries = this.reader.resolveRequestsAt(documentEntry, MetaTags.FOREACH);
    }

    public toRaw(): { content: Promise<string>; context: any; model:any}[] {
        const ret = new Array();
        for (let source of this.foreachEntries) {

            const content = this.template.apply(this.parameters, this.documentEntry, source.result, this.local());
            ret.push({
                content: content,
                context: source.request,
                model: source.result
            });
        }
        return ret;
    }

    protected local(){
        return {};
    }
}