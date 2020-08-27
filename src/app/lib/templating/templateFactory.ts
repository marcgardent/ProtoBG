import * as nunjucks from 'nunjucks';
import { Glossary } from '../tags/Glossary';
import { Pao } from '../pao/pao.tags';
import { TagExpression } from '../tags/TagExpression';
import { NunjucksTemplate } from './NunjucksTemplate';

export interface ITemplate {

    apply(parameters: any, context: any, me: any, layout : any): string;
}

export function templateFactory(
    glossary: Glossary,
    reader: TagExpression,
    templateEntry: any
): ITemplate {

    return new NunjucksTemplate(glossary, reader, templateEntry);
}
