import { TagExpression } from './TagExpression';
import { Glossary } from '../../core/glossary/Glossary';

export interface ITagContext {
    glossary: Glossary;
    reader: TagExpression;
}
