import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { Templating } from './templating.tag';
import { ITemplate } from './templateFactory';
import * as nunjucks from "nunjucks";
import { NunjucksTags } from './nunjucks.tag';
import { IMessenger } from '../report';
import { exception } from 'console';

export class NunjucksTemplate implements ITemplate {
    private readonly template: string;
    private readonly pipelines: Glossary;
    public readonly extension: any;

    constructor(private readonly messenger: IMessenger, private readonly glossary: Glossary, private readonly reader: TagExpression, private readonly nunjucksEntry: any) {
        this.template = reader.mandatoryValueAt(nunjucksEntry, Templating.DEFINITION);
        this.extension = reader.mandatoryValueAt(nunjucksEntry, Templating.EXTENSION);

        this.pipelines = new Glossary(NunjucksTags.metadata);
    }

    private addFilter(env: nunjucks.Environment, tag: string, func: (...args: any[]) => any, async?: boolean) {
        const name = this.pipelines.get(tag);
        env.addFilter(name.name, func, async);
    }

    public apply(parameters: any, context: any, me: any, local: any): Promise<string> {
        var env = new nunjucks.Environment();
        const self = this;


        this.addFilter(env, NunjucksTags.REQUEST, function (request) {
            try {
                return self.reader.resolveRequests(request);
            } catch (e) {
                self.messenger.error({ raw: e, message: `${JSON.stringify(request)} | ${NunjucksTags.REQUEST} raise an error`, entry: self.nunjucksEntry });
                throw e;
            }
        });

        this.addFilter(env, NunjucksTags.INCLUDEASTEXT, function (url, callback) {

            fetch(url).then((response: Response) => {
                return response.text();
            }, reason => {
                self.messenger.error({ raw: reason, message: ` '${url}' | ${NunjucksTags.INCLUDEASTEXT} raise an error`, entry: self.nunjucksEntry });
                callback(reason);
            }).then((text: string) => {
                callback(null, text);
            }).catch(reason => {
                self.messenger.error({ raw: reason, message: ` '${url}' | ${NunjucksTags.INCLUDEASTEXT} raise an error`, entry: self.nunjucksEntry });
                callback(reason)
            });
        }, true);

        this.addFilter(env, NunjucksTags.INCLUDEASDATAURI, function (url, callback) {
            //callback(null, url);
            fetch(url).then((response) => {
                return response.blob();
            }, reason => {
                self.messenger.error({ raw: reason, message: ` '${url}' | ${NunjucksTags.INCLUDEASDATAURI} raise an error`, entry: self.nunjucksEntry });
                console.error(NunjucksTags.INCLUDEASDATAURI, url, reason);
                callback(reason);
            }).then((blob: Blob) => {
                var reader = new FileReader();
                reader.onload = function () {
                    callback(null, this.result);
                };
                reader.onerror = function (ev) {
                    self.messenger.error({ raw: ev, message: ` '${url}' | ${NunjucksTags.INCLUDEASDATAURI} raise an error`, entry: self.nunjucksEntry });
                    callback(ev);
                }
                reader.readAsDataURL(blob);
            }).catch(reason => {
                self.messenger.error({ raw: reason, message: ` '${url}' | ${NunjucksTags.INCLUDEASDATAURI} raise an error`, entry: self.nunjucksEntry });
                callback(reason)
            });
        }, true);

        this.addFilter(env, NunjucksTags.FROMCONTEXT, function (key, defaultVal) {
            try {
                return self.reader.fallback(defaultVal, context, ...self.reader.asArray(key));
            }
            catch (e) {
                self.messenger.error({ raw: e, message: ` ${JSON.stringify(key)} | ${NunjucksTags.FROMCONTEXT}(${JSON.stringify(defaultVal)}) raise an error`, entry: self.nunjucksEntry });
            }
        });

        this.addFilter(env, NunjucksTags.FROMPARAMETERS, function (key, defaultVal) {
            try {
                return self.reader.fallback(defaultVal, parameters, ...self.reader.asArray(key));
            }
            catch (e) {
                self.messenger.error({ raw: e, message: ` ${JSON.stringify(key)} | ${NunjucksTags.FROMPARAMETERS}(${JSON.stringify(defaultVal)}) raise an error`, entry: self.nunjucksEntry });
            }
        });

        this.addFilter(env, NunjucksTags.FROMMODEL, function (key, defaultVal) {
            try {
                return self.reader.fallback(defaultVal, me, ...self.reader.asArray(key));
            }
            catch (e) {
                self.messenger.error({ raw: e, message: ` ${JSON.stringify(key)} | ${NunjucksTags.FROMMODEL}(${JSON.stringify(defaultVal)}) raise an error`, entry: self.nunjucksEntry });
            }
        });

        this.addFilter(env, NunjucksTags.FROMGLOSSARY, function (key, defaultVal) {
            try {
                return self.reader.fallback(defaultVal, self.glossary.glossary, ...self.reader.asArray(key));
            }
            catch (e) {
                self.messenger.error({ raw: e, message: ` ${JSON.stringify(key)} | ${NunjucksTags.FROMGLOSSARY}(${JSON.stringify(defaultVal)}) raise an error`, entry: self.nunjucksEntry });
            }
        });

        this.addFilter(env, NunjucksTags.ARRAYFROMGLOSSARY, function (keys) {
            try {
                return self.reader.asArray(keys).map(x => self.glossary.get(x));
            }
            catch (e) {
                self.messenger.error({ raw: e, message: ` ${JSON.stringify(keys)} | ${NunjucksTags.ARRAYFROMGLOSSARY} raise an error`, entry: self.nunjucksEntry });
            }
        });

        this.addFilter(env, NunjucksTags.QUANTITY, function (exp) {
            try {
                return self.reader.asQuantity(exp);
            }
            catch (e) {
                self.messenger.error({ raw: e, message: ` ${JSON.stringify(exp)} | ${NunjucksTags.QUANTITY} raise an error`, entry: self.nunjucksEntry });
            }
        });

        this.addFilter(env, NunjucksTags.ARRAYOFQUANTITIES, function (exp) {
            try {
                return self.reader.asArrayOfQuantities(exp);
            }
            catch (e) {
                self.messenger.error({ raw: e, message: ` ${JSON.stringify(exp)} | ${NunjucksTags.ARRAYOFQUANTITIES} raise an error`, entry: self.nunjucksEntry });
            }
        });

        this.addFilter(env, NunjucksTags.ARRAYOFDISPLAYNAME, function (exp) {
            try {
                return self.reader.asArray(exp).map(x => self.reader.asDisplayName(x));
            }
            catch (e) {
                self.messenger.error({ raw: e, message: ` ${JSON.stringify(exp)} | ${NunjucksTags.ARRAYOFDISPLAYNAME} raise an error`, entry: self.nunjucksEntry });
            }
        });

        this.addFilter(env, NunjucksTags.DISPLAYNAME, function (exp) {
            try {
                self.reader.asDisplayName(exp);
            }
            catch (e) {
                self.messenger.error({ raw: e, message: ` ${JSON.stringify(exp)} | ${NunjucksTags.DISPLAYNAME} raise an error`, entry: self.nunjucksEntry });
            }
        });

        this.addFilter(env, NunjucksTags.MILLIMETER, function (exp) {
            try {
                return self.reader.asQuantity(exp).value;
            }
            catch (e) {
                self.messenger.error({ raw: e, message: ` ${JSON.stringify(exp)} | ${NunjucksTags.MILLIMETER} raise an error`, entry: self.nunjucksEntry });
            }
        });

        return new Promise<string>((resolve, reject) => {
            env.renderString(this.template, local, function (err, res) {
                if (err) {
                    self.messenger.error({ message: err.message, entry: self.nunjucksEntry, raw: err });
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }
}