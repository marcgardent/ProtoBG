import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ElectronService } from 'ngx-electron';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.less' ]
})
export class AppComponent implements OnInit  {

  private readonly electronWindow: Electron.BrowserWindow;
  private readonly fs: any;
  
  constructor(private readonly electronService: ElectronService, private httpClient: HttpClient) {
    this.electronWindow = this.electronService.remote.getCurrentWindow();

    this.fs = this.electronService.remote.require("fs").promises;
    
  }

  ngOnInit(): void {

  }

  // async FileSystemLoader(ref:string): Promise<any>{
  //   const data = await this.fs.readFile("D:/tmp/blueprint/samples/py-protogame/"+ ref, "utf8");
  //   const json = YAML.parse(data);
  //   json.__file__ = ref;
  //   return json;
  // }
}