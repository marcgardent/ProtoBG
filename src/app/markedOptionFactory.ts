import { MarkedOptions, MarkedRenderer } from 'ngx-markdown';
 
// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  
  renderer.code = (code:string, lang:string, isEscaped : boolean) => {
    if(lang !=="csv") {
      return "<p><pre>"+code+"</pre></p>";
    }
    else {
      const model = new Array<Array<string>>();
      const rows  = code.split("\n");
      let maxCells = 0;
      for(let row of rows){
        const cells = row.split(",")
        model.push(cells);
        maxCells = Math.max(maxCells, cells.length);
      }
      let ret = "<table>"
      for(let r = 0; r<model.length;r++){
        ret += "<tr>";
        const cells = model[r]
        for(let c =0; c<cells.length; c++){
          ret += "<td>"+cells[c]+"</td>";
        }
        for(let c =0; c<maxCells -cells.length; c++){ 
        ret += "<td></td>";
        }
        ret += "</tr>";
      }
      return ret;
    }
  }
  
  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}