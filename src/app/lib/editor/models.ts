
export interface IResource {
    name: string;
    content: string;
    type: string;
  }
  
  export interface IWorkspace {
    name: string;
    currentResource: string;
    resources: Array<IResource>;
  }
  
  export interface IWarehouse {
    saved : string;
    currentWorkspace: string;
    workspaces: Array<IWorkspace>;
  }