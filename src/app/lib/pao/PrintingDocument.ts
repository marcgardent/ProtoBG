import { MetaTags } from '../tags/meta.tags';
import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { templateFactory, ITemplate } from '../templating/templateFactory';
import { Templating } from '../templating/templating.tag';
import { Pao } from './pao.tags';
/**
 * properties: 📄format 🔄orientation 📏margins 📐template 📐parameters 📑foreach
 */
export class PrintingDocument {
    private readonly template: ITemplate;
    private readonly foreachEntries: any[];
    private readonly parameters: any;
    private readonly layout:any; 
    
    constructor(private readonly glossary: Glossary, private readonly reader: TagExpression, private readonly documentEntry: any) {
        // check
        this.parameters = reader.mandatoryValueAt(documentEntry, Templating.PARAMETERS);

        const format = reader.mandatoryReferenceAt(documentEntry, Pao.FORMAT);
        const min = reader.quantityOf(reader.mandatoryValueAt(format, Pao.MIN));
        const max = reader.quantityOf(reader.mandatoryValueAt(format, Pao.MAX));
        const orientation = reader.mandatoryValueAt(documentEntry, Pao.ORIENTATION);
        const margins = reader.quantityOf(reader.mandatoryValueAt(documentEntry, Pao.MARGINS));


        const width = orientation == Pao.LANDSCAPE ? max.value : min.value;
        const height = orientation == Pao.LANDSCAPE ? min.value : max.value;
        const padding = margins.value > 0 ? margins.value : 0;
        const bleed = margins.value < 0 ? -margins.value : 0
        const bleedOrPadding = padding + bleed;
        
        this.layout = {
            content: {
                x: bleedOrPadding,
                y: bleedOrPadding,
                width: width - padding * 2,
                height: height - padding * 2,
            },
            page: {
                width: width + bleed * 2,
                height: height + bleed * 2,
            },
            background: {
                x: padding,
                y: padding,
                width: width + bleed * 2 - padding *2,
                height: height + bleed * 2- padding *2,
            }
        }
        console.debug(this.layout);

        const templateEntry = reader.mandatoryReferenceAt(documentEntry, Templating.TEMPLATE);
        this.template = templateFactory(glossary, reader, templateEntry);
        this.foreachEntries = reader.resolveRequestsAt(documentEntry, MetaTags.FOREACH);
    }

    public toImages(): {
        content: string;
        quantity: number;
    }[] {
        const ret = new Array();
        for (let source of this.foreachEntries) {
            const content = this.template.apply(this.parameters, this.documentEntry, source.result, this.layout);
            const copies = this.reader.coalesce(parseInt(source.request["🖨️copies"]), 1);
            ret.push({
                content: "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(content))),
                copies: copies,
                width: this.layout.page.width,
                height: this.layout.page.height
            });
        }
        return ret;
    }
}
