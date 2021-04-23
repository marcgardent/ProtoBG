import { Glossary } from './Glossary';
import { MetaTags } from './meta.tags';
import { Entry } from './Entry';
import { IMessenger } from '../report';
export class TagExpression {

    entryHas(entry: any, tag: string) {
        if (!entry || !entry.tags) {
            debugger;
        }
        return entry.tags.indexOf(tag) > -1;
    }

    constructor(private readonly messenger: IMessenger, private readonly glossary: Glossary) {

    }

    public mandatoryValueAt(entry: any, tag: string) {
        if (entry[tag] == undefined) {
            this.messenger.error({message: `except the property: ${tag}`, entry: entry })
            throw Error("except the property:" + tag);
        }
        return entry[tag];
    }

    public mandatoryReferenceAt(entry: any, tag: string) {
        const ref = this.mandatoryValueAt(entry, tag);
        const val = this.glossary.get(ref);
        if (val == undefined) {
            this.messenger.error({message: `except the property: ${tag}`, entry: entry })
            throw Error("except the entry named:" + tag);
        }
        return val;
    }

    public asQuantity(value: string) {
        if (value) {
            const parsed = value.match(/^((-)?\d+(\.\d+)?)(\W+\w+)?$/);
            if (parsed) {
                return {
                    value: parseFloat(parsed[1]),
                    unit: this.glossary.get(parsed[4])
                };
            }
            else {
                const entry = this.glossary.get(value);
                if (entry) {
                    return {
                        value: undefined,
                        unit: entry
                    };
                }
                else {
                    return { value: undefined, unit: undefined }
                }
            }
        }
        else {
            return { value: undefined, unit: undefined }
        }
    }

    public asDisplayName(raw: any) {

        const entry = new Entry(this.glossary, raw);
        if (entry.isValid) {
            return entry.icon + this.coalesce(entry.title, entry.name);
        }
        else {
            return "🚫undefined";
        }
    }

    public resolveRequestsAt(entry: any, field: string): { result: any, request: any }[] {
        if (field in entry) {
            const forExp = entry[field];
            return this.resolveRequests(forExp);
        }
        return [];
    }


    public resolveRequests(forExp: any): { result: any, request: any }[] {
        const ret = []
        if (Array.isArray(forExp)) {
            for (let exp of forExp) {
                ret.push(...this.resolveRequest(exp))
            }
        }
        else {
            ret.push(...this.resolveRequest(forExp))
        }
        return ret;
    }

    public asArray(value: any) {
        if (Array.isArray(value)) {
            return value;
        }
        else if (typeof value === "string") {
            return value.split(/\s+/).filter(x => x != "");
        }
        else {
            return [value];
        }
    }

    asArrayOfQuantities(value: any) {
        const ret = [];
        for (let val of this.asArray(value)) {
            ret.push(this.asQuantity(val));
        }
        return ret;
    }

    coalesce(...arg0: any[]) {
        for (let v of arg0) {
            if (v) return v;
        }
        return undefined;
    }

    public fallback(defaultValue: any, source, ...keys: string[]): any {
        for (let key of keys) {
            const val = source[key];
            if (val !== undefined) return source[key];
        }
        return defaultValue;
    }

    public resolveRequest(exp: any): { result: any, request: any }[] {
        const ret = [];
        if (exp) {
            if (MetaTags.IS in exp) {
                ret.push({
                    result: this.glossary.get(exp[MetaTags.IS]),
                    request: exp
                });
            }

            else if (MetaTags.AMONG in exp) {

                const request = this.glossary.search.atLeastOne(...this.asArray(exp[MetaTags.AMONG]));
                if (MetaTags.WITH in exp) {
                    request.with(...this.asArray(exp[MetaTags.WITH]))
                }
                ret.push(...[...request.toList()].map(e => { return { result: e, request: exp }; }));
            }
        }

        return ret;
    }
}
