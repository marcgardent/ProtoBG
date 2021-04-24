
export interface IResource {
  name: string;
  content: string;
  type: string;
}

export interface IWorkspace {
  saved: string;
  currentResource: string;
  resources: Array<IResource>;
}

export interface IBook {
  name : string,
  resources : Array<IResource>,
  dependencies : Set<string>,
}