import { Component, OnDestroy, OnInit } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/app/layout/contracts';

@Component({
  selector: 'app-bundle-viewer',
  templateUrl: './bundle-viewer.component.html',
  styleUrls: ['./bundle-viewer.component.sass']
})
export class BundleViewerComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent  {

  constructor() {
    super();
  }

  link(header: any) {
    
  }

  ngOnInit(): void {
  }

  // private processAsBundle() {
  //   if (this.glossary) {
  //     const ctx = new MainContext(this.glossaryService, this.glossary, new TagExpression(this.glossaryService, this.glossary));
  //     this.currentExport = this.glossary.get(this.currentExport.icon + this.currentExport.name);
  //     const zipper = ctx.entryAsBundle(this.currentExport);
  //     if (zipper) {
  //       zipper.toZip().then((r) => {
  //         this.bundleResult = { files: r.files, filename: r.filename };
  //         r.content.then((x) => {
  //           this.setDownload(r.filename, x);
  //         });
  //       });
  //     }
  //   }
  // }

  // onGlossaryUpdated() {
  //   if (this.glossary) {
  //     this.bundles = [...this.glossary.search.atLeastOne(BundleTags.BUNDLE).toList()];
  //   }
  // }


}
