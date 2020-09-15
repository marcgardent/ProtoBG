import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { MetaTags } from '../tags/meta.tags';
import * as JSZip from 'jszip';
import { IDocument } from "./IDocument";
import { BundleTags } from "./Bundle.tags";

export class Bundle {
  private readonly filename: any;
  private readonly foreachEntries: { result: any; request: any; }[];

  constructor(
    private readonly glossary: Glossary,
    private readonly reader: TagExpression,
    private readonly bundleEntry: any,
    private readonly documentFactory: (entry: any) => IDocument) {
    this.filename = this.reader.mandatoryValueAt(bundleEntry, BundleTags.FILENAME);
    this.foreachEntries = this.reader.resolveRequestsAt(bundleEntry, MetaTags.FOREACH);
  }
  
  public toZip() {

    const rdz = [];

    for (let occurrence of this.foreachEntries) {
      const documents = this.documentFactory(occurrence.result);
      if (documents) {
        for (let doc of documents.toRaw()) {
          rdz.push(doc.content.then(x => { return { content: x, base64: doc.base64, filename: doc.model.name + "." + doc.type }; }));
        }
      }
    }

    return Promise.all(rdz).then((files) => {
      var zip = new JSZip();
      const list = [];
      for (let file of files) {
        zip.file(file.filename, file.content, { base64: file.base64 });
        list.push({ filename: file.filename });
      }

      return {
        content: zip.generateAsync({ type: "base64" }).then(base64 => "data:application/zip;base64," + base64),
        filename: this.filename,
        files: list
      };
    });
  }
}
