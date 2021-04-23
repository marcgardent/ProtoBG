
export interface IDocument {
  toRaw(): { content: Promise<string>; type: string; base64: boolean; context: any; model: any; }[];
}
