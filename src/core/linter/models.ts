import { IResource } from "src/core/models";

export interface IBlock {
  name: string;
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
  message: string;
  lines: Array<string>;
}

export interface IReport {
  errors: Array<IBlock>;
  resource: IResource;
}



