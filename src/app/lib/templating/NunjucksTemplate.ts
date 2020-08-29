import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { Templating } from './templating.tag';
import { ITemplate } from './templateFactory';
import * as nunjucks from "nunjucks";



export class NunjucksTemplate implements ITemplate {
    private readonly template: string;

    constructor(private readonly glossary: Glossary, private readonly reader: TagExpression, private nunjucksEntry: any) {
        this.template = reader.mandatoryValueAt(nunjucksEntry, Templating.DEFINITION);
    }

    public apply(parameters:any, context: any, me: any, local: any): string {
        var env = new nunjucks.Environment();
        const self = this; 

        env.addFilter('fromContext', function (key) {
            return context[key];
        });
        
        env.addFilter('fromParameters', function (key) {
            return parameters[key];
        });

        env.addFilter('fromModel', function (key) {
            return me[key];
        });
        env.addFilter('fromGlossary', function (key) {
            return self.glossary.get(key);
        });
        env.addFilter('get', function (dict, key) {
            return dict[key];
        });
        env.addFilter('quantity', function (exp) {
            return self.reader.asQuantity(exp);
        });
        env.addFilter('arrayOfQuantities', function (exp) {
            return self.reader.asArrayOfQuantities(exp);
        });
        env.addFilter('millimeter', function (exp) {
            return self.reader.asQuantity(exp).value;
        });
        
        return env.renderString(this.template, local);
    }
}
