import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/app/core/contracts';
import { PaoTags } from 'src/app/lib/pao/pao.tags';
import { PaoContext } from 'src/app/lib/pao/PaoContext';
import { TagExpression } from 'src/app/lib/tags/TagExpression';
import { GlossaryService } from 'src/app/services/glossary.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.sass']
})
export class PdfViewerComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent {

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