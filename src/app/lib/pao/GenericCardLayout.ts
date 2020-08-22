import * as nunjucks from 'nunjucks';
import { Glossary } from '../tags/Glossary';
import { Pao } from './pao.tags';
import { TagExpression } from '../tags/TagExpression';
import { Meta } from '@angular/platform-browser';
import { Core } from './meta.tags';

export class GenericCardLayout {

    constructor(private readonly glossary: Glossary, private readonly reader: TagExpression) {
    
    }

    public toSvg(layout: any): {content:string, quantity:number}[] {
        const ret = new Array();
        const sources = this.reader.resolveRequestsAt(layout, "TODO FIX FOREACH TAG");
        for (let source of sources) {
            const card = this.apply(layout, source.result);
            const quantity = this.reader.coalesce(parseInt(source.request["🖨️copies"]), 1);
            ret.push({content: card, quantity: quantity})
        }
        return ret;
    }

    private apply(layout: any, me: any) {
        var env = new nunjucks.Environment();
        const self = this;

        env.addFilter('fromLayout', function (key) {

            return layout[key];
        });

        env.addFilter('fromMe', function (key) {

            return me[key];
        });

        env.addFilter('fromGlossary', function (key) {
            return self.glossary.get(key);
        });

        env.addFilter('get', function (dict, key) {
            return dict[key];
        });

        env.addFilter('quantity', function (exp) {
            return self.reader.quantityOf(exp);
        });

        env.addFilter('millimeter', function (exp) {
            return self.reader.quantityOf(exp).value;
        });

        return env.renderString("TODO TEMPLATE", layout);
    }
}