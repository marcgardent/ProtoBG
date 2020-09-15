import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { MetaTags } from '../tags/meta.tags';
import * as JSZip from 'jszip'
import { IProducer } from '../MainContext';
import { Entry } from '../tags/Entry';

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
  private readonly foreachEntries: {result: any, request: any}[];

  constructor(
    private readonly glossary: Glossary,
    private readonly reader: TagExpression,
    private readonly bundleEntry: any,
    private readonly documentFactory: (entry: any) => IDocument) {
    this.filename = this.reader.mandatoryValueAt(bundleEntry, BundleTags.FILENAME);
    this.foreachEntries = this.reader.resolveRequestsAt(bundleEntry, MetaTags.FOREACH);
  }

  public toZip() {

    for (let occurrence of this.foreachEntries) {
      const documents = this.documentFactory(occurrence.result); // if TODO undefined

      const rdz = []
      for (let doc of documents.toRaw()) {
        rdz.push(doc.content.then(x => { return { content: x, base64: doc.base64, filename: occurrence.result.name + "." + doc.type }; }));
        
      }

      return Promise.all(rdz).then((files) => {
        var zip = new JSZip();
        const list = [];
        for (let file of files) {
          zip.file(file.filename, file.content, { base64: file.base64 });
          list.push({ filename: file.filename })
        }

        return {
          content: zip.generateAsync({ type: "base64" }).then(base64=> "data:application/zip;base64," + base64),
          filename: this.filename,
          files: list
        };
      });
    }
  }
}