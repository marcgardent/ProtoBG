import { Component, OnInit } from '@angular/core';
import { PaoTags } from 'src/app/lib/pao/pao.tags';
import { PaoContext } from 'src/app/lib/pao/PaoContext';
import { TagExpression } from 'src/app/lib/tags/TagExpression';
import { GlossaryService } from 'src/app/services/glossary.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.sass']
})
export class PdfViewerComponent implements OnInit {

  public static Icon = '🖨️';
  public static Name = 'PDF Viewer';

  private get glossary() { return this.glossaryService.glossary; }
  constructor(readonly glossaryService : GlossaryService) {
    this.glossaryService.currentGlossary.subscribe((g) => {
      this.onGlossaryUpdated();
    });
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