import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { MetaTags } from '../tags/meta.tags';
import * as JSZip  from 'jszip'

/** auto generated */
export class BundleTags {

  public static FILENAME = "📦filename";
  public static FOLDER = "📦folder";
  public static BUNDLE = "📦bundle";

  public static metadata = {
    "📦filename": { "name": "filename", "icon": "📦", "codeName": "FILENAME", "tags": [] },
    "📦folder": { "name": "folder", "icon": "📦", "codeName": "FOLDER", "tags": [] },
    "📦bundle": { "properties": "📦filename 📑foreach", "name": "bundle", "icon": "📦", "codeName": "BUNDLE", "tags": [] }
  };
}

export interface IDocument {
  toRaw(): { content: Promise<string>; type: string, base64: boolean, context: any; model: any }[]
}


//TODO https://stuk.github.io/jszip/documentation/api_jszip/file_data.html#base64-option
export class Bundle {
  private readonly filename: any;
  private readonly foreachEntries: any[];

  constructor(
    private readonly glossary: Glossary,
    private readonly reader: TagExpression,
    bundleEntry: any,
    private readonly documentFactory : (entry:any) => IDocument) {
    this.filename = this.reader.mandatoryValueAt(bundleEntry, BundleTags.FILENAME);
    this.foreachEntries = this.reader.resolveRequestsAt(bundleEntry, MetaTags.FOREACH);
  }

  public toZip() {

    for(let entry of this.foreachEntries){
      const documents = this.documentFactory(entry);

      const rdz = []
      for(let doc of documents.toRaw()){
        rdz.push(doc.content.then(x=> { return {content: x, base64: doc.base64, filename: entry.name + doc.type }; }));
      }
      
      return Promise.all(rdz).then((files)=>{
        var zip = new JSZip();
        for(let file of files){
          zip.file(file.filename, file.content, {base64 : file.base64});
        }
        
        return zip.generateAsync({type : "string"});
      });

    }
  }
}