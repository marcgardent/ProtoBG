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
    private readonly layout: any;

    constructor(private readonly glossary: Glossary, private readonly reader: TagExpression, private readonly documentEntry: any) {
        // check
        this.parameters = reader.mandatoryValueAt(documentEntry, Templating.PARAMETERS);

        const format = reader.mandatoryReferenceAt(documentEntry, Pao.FORMAT);
        const min = reader.quantityOf(reader.mandatoryValueAt(format, Pao.MIN));
        const max = reader.quantityOf(reader.mandatoryValueAt(format, Pao.MAX));
        const orientation = reader.mandatoryValueAt(documentEntry, Pao.ORIENTATION);
        const bleeds = reader.quantityOf(reader.mandatoryValueAt(documentEntry, Pao.BLEEDS)).value;
        const paddings = reader.quantityOf(reader.mandatoryValueAt(documentEntry, Pao.PADDINGS)).value;
        const corners = reader.quantityOf(reader.mandatoryValueAt(documentEntry, Pao.CORNERS)).value;
        const width = orientation == Pao.LANDSCAPE ? max.value : min.value;
        const height = orientation == Pao.LANDSCAPE ? min.value : max.value;

        console.debug(bleeds, paddings, width, height)
        this.layout = {
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
            mediabox: {
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
        console.debug(this.layout);

        const templateEntry = reader.mandatoryReferenceAt(documentEntry, Templating.TEMPLATE);
        this.template = templateFactory(glossary, reader, templateEntry);
        this.foreachEntries = reader.resolveRequestsAt(documentEntry, MetaTags.FOREACH);
    }

    public toImages(): {
        content: string;
        copies: number;
        width: number;
        height: number;
    }[] {
        const ret = new Array();
        for (let source of this.foreachEntries) {
            const content = this.template.apply(this.parameters, this.documentEntry, source.result, this.layout);
            const copies = this.reader.coalesce(parseInt(source.request["🖨️copies"]), 1);
            ret.push({
                content: "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(content))),
                copies: copies,
                width:  this.layout.mediabox.width,
                height: this.layout.mediabox.height
            });
        }
        return ret;
    }
}
