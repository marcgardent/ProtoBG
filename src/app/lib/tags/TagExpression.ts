import { Glossary } from './Glossary';
export class TagExpression {

    constructor(private readonly glossary: Glossary) {

    }

    public quantityOf(exp: string) {
        const parsed = exp.match(/^(\d+(\.\d+)?)(\W+\w+)?$/);
        if (parsed) {
            return {
                value: parseFloat(parsed[1]),
                unit: this.glossary.get(parsed[3])
            };
        }
    }

    public resolveRequestsAt(entry: any, field: string) {
        const ret = []
        if (field in entry) {
            const forExp = entry[field];
            if (Array.isArray(forExp)) {
                for(let exp of forExp){
                    ret.push(...this.resolveRequest(exp))
                }
            }
            else{
                ret.push(...this.resolveRequest(forExp))
            }
        }
        return ret;
    }

    public asArray(value:any){
        if(Array.isArray(value)){
            return value;
        }
        else {
            return value.split(/\s+/);
        }
    }
    
    coalesce(...arg0: any[]) {
        for(let v of arg0){
            if(v) return v;
        }
        return undefined;
    }

    public resolveRequest(exp:any): any[]{
        const ret = [];
        if("📑is" in exp){
            ret.push({
                result : this.glossary.get(exp["📑is"]),
                request: exp
            });
        }

        else if("📑atLeastOne" in exp){

            const request = this.glossary.search.atLeastOne(...this.asArray(exp["📑atLeastOne"]));    
            if("📑with" in exp){
                request.with(...this.asArray(exp["📑with"]))
            }

            ret.push(...request.toList());
        }

        return ret; 
    }
}


/**
 * experimental
 * TODO delete
 */
class Pipe {

    private result = []

    constructor(...values : any[]){
        this.result = [...values];
    }

    public t(self:any, f : any, ...kArgs : any[]) {
        const next = [];
        for(let v of this.result) {
            const n = Reflect.apply(f, self, [v, ...kArgs]) ;
            if(n){
                next.push(n);
            }
        }
        return this;
    }
    
    static sample(){
        new Pipe("coco", "toto").t(undefined, (x)=>{x.toUpper()}).toResult();
    }

    public toResult(){
        return this.result;
    }
}