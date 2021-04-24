import { TagExpression } from '../workers/tags/TagExpression';
import { Glossary } from '../workers/tags/Glossary';
import { PaoContext } from '../workers/pao/PaoContext';
import { ITagContext } from '../workers/tags/ITagContext';
import { Entry } from '../workers/tags/Entry';
import { PaoTags } from '../workers/pao/pao.tags';
import { Templating } from '../workers/templating/templating.tag';
import { IDocument } from "./bundle/IDocument";
import { Bundle } from "./bundle/Bundle";
import { RawDocument } from '../workers/templating/RawDocument';
import { Printing } from '../workers/pao/printing/Printing';
import { IMessenger } from './report';

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
