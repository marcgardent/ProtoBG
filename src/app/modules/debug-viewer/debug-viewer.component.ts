import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/app/layout/contracts';
import { GlossaryService } from 'src/app/services/glossary.service';

@Component({
  selector: 'app-debug-viewer',
  templateUrl: './debug-viewer.component.html',
  styleUrls: ['./debug-viewer.component.sass']
})
export class DebugViewerComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent  {

  constructor(private readonly glossaryService : GlossaryService) {
    super();
  }

  link(header: any) {
    
  }

  ngOnInit(): void {
  }

  

  public get reports() { return this.glossaryService.reports; }
  public get runtimeErrors() { return this.glossaryService.runtimeErrors; }


}
