import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/frontend/app/layout/contracts';
import { PaoTags } from 'src/workers/pao/pao.tags';
import { PaoContext } from 'src/workers/pao/PaoContext';
import { TagExpression } from 'src/workers/tags/TagExpression';
import { GlossaryService } from 'src/frontend/app/services/glossary.service';

@Component({
  selector: 'app-printable-viewer',
  templateUrl: './printable-viewer.component.html',
  styleUrls: ['./printable-viewer.component.sass']
})
export class PrintableViewerComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent {

  private get glossary() { return this.glossaryService.glossary; }
  constructor(readonly glossaryService : GlossaryService) {
    super();
    this.subUntilOnDestroy(this.glossaryService.currentGlossary, (g) => {
      this.onGlossaryUpdated();
    });
   }

  link(header: any) {

  }

  ngOnInit(): void {

  }

  public pdfSrc: string = undefined;
  public printings = [];
  private readonly defaultExports = { icon: '🖨️', name: 'No PDF Export defined' };
  public currentExport: any = this.defaultExports;
  
  private onGlossaryUpdated() {
    if (this.glossary) {
      this.printings = [...this.glossary.search.atLeastOne(PaoTags.ASSEMBLING, PaoTags.PRINTING).toList()];
      if(this.printings.length>0){ this.currentExport = this.printings[0]}
      this.processAsPDF();
    }
  }

  private processAsPDF() {
    if (this.glossary) {
      const pao = new PaoContext(this.glossaryService, this.glossary, new TagExpression(this.glossaryService, this.glossary));
      this.currentExport = this.glossary.get(this.currentExport.icon + this.currentExport.name);
      if (this.currentExport) {
        const p = pao.entryAsPrinting(this.currentExport);
        p.toPdf().then(x => {
          this.pdfSrc = x;
        });
      }
      else {
        this.currentExport = this.defaultExports;
      }
    }
  }
}