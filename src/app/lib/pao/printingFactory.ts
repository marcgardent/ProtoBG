import { Printing } from './Printing';
import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';


export interface IPrinting {
    toPdf(): Promise<string>;
}

export function printingFactory(
    glossary: Glossary,
    reader: TagExpression,
    printingEntry: any
): IPrinting {

    return new Printing(glossary, reader, printingEntry);
}

