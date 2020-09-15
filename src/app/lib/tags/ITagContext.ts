import { TagExpression } from './TagExpression';
import { Glossary } from './Glossary';

export interface ITagContext {
    glossary: Glossary;
    reader: TagExpression;
}
