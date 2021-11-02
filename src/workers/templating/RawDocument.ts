import { IMessenger } from "src/core/report";
import { IDocument } from "src/workers/bundle/IDocument";
import { Glossary } from "src/core/glossary/Glossary";
import { SearchTags } from "src/workers/tags/search.tags";
import { TagExpression } from "src/workers/tags/TagExpression";
import { ITemplate, templateFactory } from "src/workers/templating/templateFactory";
import { Templating } from "src/workers/templating/templating.tag";

 

export class RawDocument implements IDocument {
    private readonly template: ITemplate;
    private readonly foreachEntries: any[];
    private readonly parameters: any;

    constructor(
        private readonly messenger: IMessenger,
        private readonly glossary: Glossary,
        private readonly reader: TagExpression,
        private readonly documentEntry: any,
        private readonly locals: any) {
        this.parameters = this.reader.mandatoryValueAt(documentEntry, Templating.PARAMETERS);
        const templateEntry = this.reader.mandatoryReferenceAt(documentEntry, Templating.TEMPLATE);
        this.template = templateFactory(this.messenger, this.glossary, this.reader, templateEntry);
        this.foreachEntries = this.reader.resolveRequestsAt(documentEntry, SearchTags.FOREACH);
    }

    public toRaw() {
        const ret = new Array();
        for (let source of this.foreachEntries) {

            const content = this.template.apply(this.parameters, this.documentEntry, source.result, this.locals);
            ret.push({
                content: content,
                context: source.request,
                model: source.result,
                type: this.template.extension,
                base64: false
            });
        }
        return ret;
    }
}