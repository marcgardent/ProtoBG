
export interface IRessource {
    name: string;
    content: string;
    type: string;
  }
  
  export interface IWorkspace {
    name: string;
    ressources: Array<IRessource>;
  }
  
  export interface IWarehouse {
    workspaces: Array<IWorkspace>;
  }
  
  