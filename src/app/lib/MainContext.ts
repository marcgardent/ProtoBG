import { TagExpression } from './tags/TagExpression';
import { Glossary } from './tags/Glossary';
import { PaoContext } from './pao/PaoContext';
import { ITagContext } from './tags/ITagContext';
import { Entry } from './tags/Entry';
import { PaoTags } from './pao/pao.tags';
import { Templating } from './templating/templating.tag';
import { IDocument, Bundle } from './bundle/temp';
import { RawDocument } from './templating/RawDocument';

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

    constructor(public readonly glossary: Glossary, public readonly reader: TagExpression) {
        this.pao = new PaoContext(glossary, reader);
    }

    entryAsDocument(entry: any): IDocument {
        debugger;
        const e = new Entry(this.glossary, entry);
        if (e.isValid) {
            if (e.has(PaoTags.COLLECTION)) {
                return this.pao.entryAsSvgCollection(entry);
            }
            else if (e.has(Templating.DOCUMENT)) {
                return new RawDocument(this.glossary, this.reader, entry, "txt", {});
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
}
