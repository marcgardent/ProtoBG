import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.less' ]
})
export class AppComponent implements OnInit  {

  constructor() {
    
  }

  ngOnInit(): void {

  }
}