import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/app/core/contracts';
import { fixTagsDeclaration } from 'src/app/lib/tags/TagParser';
import { exportAsTypescript } from 'src/app/lib/tags/TypescriptExporter';
import { readGlossaryFromYaml } from 'src/app/lib/tags/YamlTagLexer';
import { EventHubService } from 'src/app/services/eventhub.service';
import { GlossaryService } from 'src/app/services/glossary.service';
import { WarehouseService } from 'src/app/services/warehouse.service';

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
    fixTagsDeclaration(data);
    this.code = exportAsTypescript(data);
  }
}