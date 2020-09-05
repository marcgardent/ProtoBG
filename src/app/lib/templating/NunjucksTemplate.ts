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

    public apply(parameters: any, context: any, me: any, local: any): Promise<string> {
        var env = new nunjucks.Environment();
        const self = this;

        env.addFilter('dataUri', function (url, callback) {
            //callback(null, url);
            fetch(url).then((response) => {
                return response.blob();
            }, reason => {
                console.error("dataUri", url, reason);
                callback(reason);
            }).then((blob: Blob) => {
                var reader = new FileReader();
                reader.onload = function () {
                    console.debug("dataUri done!", url, this);
                    callback(null, this.result);
                };
                reader.onerror = function (ev) {
                    console.error("dataUri", url, ev);
                    callback(ev);
                }
                reader.readAsDataURL(blob);
            }).catch(reason => {

                console.error("dataUri", url, reason);
                callback(reason)
            });
        }, true);

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
        
        env.addFilter('quantity', function (exp) {
            return self.reader.asQuantity(exp);
        });
        env.addFilter('arrayOfQuantities', function (exp) {
            return self.reader.asArrayOfQuantities(exp);
        });
        env.addFilter('millimeter', function (exp) {
            return self.reader.asQuantity(exp).value;
        });

        return new Promise<string>((resolve, reject) => {
            env.renderString(this.template, local, function (err, res) {
                console.debug(err, res);
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
