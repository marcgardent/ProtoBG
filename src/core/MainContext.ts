import { IMessenger } from "src/core/report";
import { Bundle } from "src/workers/bundle/Bundle";
import { IDocument } from "src/workers/bundle/IDocument";
import { PaoTags } from "src/workers/pao/pao.tags";
import { PaoContext } from "src/workers/pao/PaoContext";
import { Printing } from "src/workers/pao/printing/Printing";
import { Entry } from "src/core/glossary/Entry";
import { Glossary } from "src/core/glossary/Glossary";
import { ITagContext } from "src/workers/tags/ITagContext";
import { TagExpression } from "src/workers/tags/TagExpression";
import { RawDocument } from "src/workers/templating/RawDocument";
import { Templating } from "src/workers/templating/templating.tag";

export interface IResult {
    kind : string;
    origin : Entry;
    payload : any;
}

export interface IProducer{
    toResult() : Promise<IResult>;
}

export class MainContext implements ITagContext {

    public readonly pao: PaoContext;

    constructor(private readonly messenger : IMessenger, public readonly glossary: Glossary, public readonly reader: TagExpression) {
        this.pao = new PaoContext(messenger, glossary, reader);
    }

    entryAsDocument(entry: any): IDocument {
        const e = new Entry(this.glossary, entry);
        if (e.isValid) {
            if (e.has(PaoTags.COLLECTION)) {
                return  this.pao.entryAsSvgCollection(entry);
            }
            else if (e.has(PaoTags.PRINTING)){
                return new Printing(this.pao, entry);
            }
            else if (e.has(Templating.DOCUMENT)) {
                return new RawDocument(this.messenger, this.glossary, this.reader, entry, {});
            }
            else {
                console.error("this entry is not a Document", entry)
                return undefined;
            }
        }
    }

    entryAsBundle(entry: any) : Bundle {
        return new Bundle(this.glossary, this.reader, entry, (entry)=> this.entryAsDocument(entry));
    }


    allExports(){
        const exports = this.glossary.search.atLeastOne(Templating.DOCUMENT, PaoTags.PRINTING, PaoTags.ASSEMBLING).toList();
        return exports;
    }
}
