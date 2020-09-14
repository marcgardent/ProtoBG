import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { Templating } from './templating.tag';
import { ITemplate } from './templateFactory';
import * as nunjucks from "nunjucks";
import { NunjucksTags } from './nunjucks.tag';

export class NunjucksTemplate implements ITemplate {
    private readonly template: string;
    private readonly pipelines: Glossary;

    constructor(private readonly glossary: Glossary, private readonly reader: TagExpression, private nunjucksEntry: any) {
        this.template = reader.mandatoryValueAt(nunjucksEntry, Templating.DEFINITION);
        this.pipelines = new Glossary(NunjucksTags.metadata);
    }

    private addFilter(env: nunjucks.Environment, tag: string, func: (...args: any[]) => any, async?: boolean) {
        const name = this.pipelines.get(tag);
        env.addFilter(name.name, func, async);
    }

    public apply(parameters: any, context: any, me: any, local: any): Promise<string> {
        var env = new nunjucks.Environment();
        const self = this;

        this.addFilter(env, NunjucksTags.DATAURI, function (url, callback) {
            //callback(null, url);
            fetch(url).then((response) => {
                return response.blob();
            }, reason => {
                console.error(NunjucksTags.DATAURI, url, reason);
                callback(reason);
            }).then((blob: Blob) => {
                var reader = new FileReader();
                reader.onload = function () {
                    console.debug("dataUri done!", url, this);
                    callback(null, this.result);
                };
                reader.onerror = function (ev) {
                    console.error(NunjucksTags.DATAURI, url, ev);
                    callback(ev);
                }
                reader.readAsDataURL(blob);
            }).catch(reason => {

                console.error(NunjucksTags.DATAURI, url, reason);
                callback(reason)
            });
        }, true);

        this.addFilter(env, NunjucksTags.FROMCONTEXT, function (key, defaultVal) {
            return self.reader.fallback(defaultVal, context, ...self.reader.asArray(key));
        });

        this.addFilter(env, NunjucksTags.FROMPARAMETERS, function (key, defaultVal) {
            return self.reader.fallback(defaultVal, parameters, ...self.reader.asArray(key));
        });

        this.addFilter(env, NunjucksTags.FROMMODEL, function (key, defaultVal) {
            return self.reader.fallback(defaultVal, me, ...self.reader.asArray(key));
        });

        this.addFilter(env, NunjucksTags.FROMGLOSSARY, function (key, defaultVal) {
            return self.reader.fallback(defaultVal, self.glossary.glossary, ...self.reader.asArray(key));
        });

        this.addFilter(env, NunjucksTags.ARRAYFROMGLOSSARY, function (keys) {
            return self.reader.asArray(keys).map(x=> self.glossary.get(x));
            
        });


        this.addFilter(env, NunjucksTags.QUANTITY, function (exp) {
            return self.reader.asQuantity(exp);
        });

        this.addFilter(env, NunjucksTags.ARRAYOFQUANTITIES, function (exp) {
            return self.reader.asArrayOfQuantities(exp);
        });

        this.addFilter(env, NunjucksTags.ARRAYOFDISPLAYNAME, function (exp) {
            return self.reader.asArray(exp).map(x => self.reader.asDisplayName(x));
        });

        this.addFilter(env, NunjucksTags.DISPLAYNAME, function (exp) {
            self.reader.asDisplayName(exp);
        });

        this.addFilter(env, NunjucksTags.MILLIMETER, function (exp) {
            return self.reader.asQuantity(exp).value;
        });

        return new Promise<string>((resolve, reject) => {
            env.renderString(this.template, local, function (err, res) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }
}