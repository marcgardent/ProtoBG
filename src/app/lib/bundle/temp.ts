import { Glossary } from '../tags/Glossary';
import { TagExpression } from '../tags/TagExpression';
import { MetaTags } from '../tags/meta.tags';

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
  toRaw(): { content: Promise<string>; context: any; model: any }[]
}


//TODO https://stuk.github.io/jszip/documentation/api_jszip/file_data.html#base64-option
export class Bundle {
  private readonly filename: any;
  private readonly foreachEntries: any[];

  constructor(
    private readonly glossary: Glossary,
    private readonly reader: TagExpression,
    private readonly bundleEntry: any,
    private readonly documentFactory) {
    this.filename = this.reader.mandatoryValueAt(bundleEntry, BundleTags.FILENAME);
    this.foreachEntries = this.reader.resolveRequestsAt(bundleEntry, MetaTags.FOREACH);
  }

  public toZip() {

  }
}