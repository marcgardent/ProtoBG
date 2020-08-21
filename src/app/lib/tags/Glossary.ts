import { Search } from './Search';

export class Glossary {
    private readonly glossary: Map<string, any>;
    public readonly search: Search<string, any>;

    constructor(...sources: any[]) {
        this.glossary = mergeSources(...sources);
        this.search = newSearch(this.glossary);
    }

    get(index: string){
        return this.glossary[index];
    }
}


function mergeSources(...sources: any[]) {
    
    const ret = new Map<string,any>()
    for(let glossary of sources){
        for(let key in glossary){
            const item = glossary[key];
            if(ret.has(key)){
                console.debug("ignore the conflict", key, ret[key], item)
            }
            else{
                ret[key] = item;
            }
        }
    }

    return ret;
}

function newSearch(bible:Map<string,any>){
    const search = new Search<string,any>();
    for(let key in bible){
        const item = bible[key];
        const tags =item.tags ? item.tags : [];
        search.add(item, tags);
    }

    return search;
}