import * as nunjucks from 'nunjucks';
import { Glossary } from '../../core/glossary/Glossary';
import { PaoTags } from '../pao/pao.tags';
import { TagExpression } from '../tags/TagExpression';
import { NunjucksTemplate } from './NunjucksTemplate';
import { IMessenger } from '../../core/report';

export interface ITemplate {

    apply(parameters: any, context: any, me: any, layout: any): Promise<string>;
    extension: string;
}

export function templateFactory(
    messenger: IMessenger,
    glossary: Glossary,
    reader: TagExpression,
    templateEntry: any
): ITemplate {

    return new NunjucksTemplate(messenger, glossary, reader, templateEntry);
}

