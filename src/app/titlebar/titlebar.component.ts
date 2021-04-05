import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {
  private readonly windowManager: any;
  public isMaximized: boolean = true;

  constructor() {
    this.windowManager = (window as any).windowManager;
    this.windowManager.isMaximized((value)=>{this.isMaximized = value})
  }

  ngOnInit() {

  }

  public minimize(){
    this.windowManager?.minimize();
  }
    
  public maximize(){
    this.windowManager?.maximize();
  }

  public unmaximize(){
    this.windowManager?.unmaximize();
  }

  public close(){
    this.windowManager?.close();
  }
}