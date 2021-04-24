import { Component, OnInit, Input } from '@angular/core';
import { FileSystemService } from 'src/frontend/app/services/file-system.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.sass']
})
export class TitlebarComponent implements OnInit {
  private readonly windowManager: any;
  public isMaximized: boolean = true;

  constructor(public readonly fs: FileSystemService) {
    this.windowManager = (window as any).windowManager;
    this.windowManager.isMaximized((value) => { this.isMaximized = value })
  }

  ngOnInit() {

  }

  public minimize() {
    this.windowManager?.minimize();
  }

  public maximize() {
    this.windowManager?.maximize();
  }

  public unmaximize() {
    this.windowManager?.unmaximize();
  }

  public close() {
    this.windowManager?.close();
  }

  public openFolder() {
    this.fs.load(); // TODO DESIGN replace public event
  }
}