import { Glossary } from './Glossary';

export class Entry {

    constructor(private readonly glossary: Glossary, private readonly data: any) {
    }

    get isValid() {
        return this.data && typeof (this.data.name) === 'string' && typeof (this.data.icon) === 'string';
    }
    
    get name() {
        return this.data.name;
    }
    
    get icon() {
        return this.data.icon;
    }

    get displayName() {
        return this.data.title ? `${this.data.icon}${this.data.title}` : this.canonicalName;
    }
    get canonicalName() {
        return `${this.data.icon}${this.data.name}`;
    }
    get tags(): Array<Entry> {
        return this.data.tags ? this.data.tags.map(x => this.glossary.getAsEntry(x)) : [];
    }

    get description() {
        return this.data.description ? this.data.description : "";
    }

    get hasProperties() {
        return this.data && this.data.properties;
    }

    get properties() {
        return this.hasProperties ? this.asArray(this.data.properties) : [];
    }

    private asArray(value: any) {
        if (Array.isArray(value)) {
            return value;
        }
        else if (typeof (value) === 'string') {
            return value.split(/\s+/);
        }
        else {
            return [];
        }
    }
}
