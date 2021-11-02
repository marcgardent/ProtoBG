import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/frontend/app/layout/contracts';

import { GlossaryService } from 'src/frontend/app/services/glossary.service';
import { WarehouseService } from 'src/frontend/app/services/warehouse.service';
import { exportAsTypescript } from 'src/workers/typescript/TypescriptExporter';
import { readGlossaryFromYaml } from 'src/core/glossary/GlossaryReader';

@Component({
  selector: 'app-text-viewer',
  templateUrl: './text-viewer.component.html',
  styleUrls: ['./text-viewer.component.sass']
})
export class TextViewerComponent  extends ComponentBase implements OnInit, OnDestroy, BodyComponent {
  
  public code  = "";

  constructor(private readonly glossaryService : GlossaryService, private readonly warehouseService : WarehouseService) {
    super();
    this.subUntilOnDestroy(glossaryService.currentGlossary, ()=> {this.processAsCode()});
  }

  link(header: any) {
    
  }

  ngOnInit(): void {
    
  }

  private processAsCode() {
    //TODO DESIGN move to PROCESSING  -> WITH TXT OUTPUT
    const data = readGlossaryFromYaml(this.glossaryService.mergeAll(this.warehouseService.workspace));
    this.code = exportAsTypescript(data);
  }
}