import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SecurityContext } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { markedOptionsFactory } from './markedOptionFactory';
import { MyMaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefinitionComponent } from './definition/definition.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    DefinitionComponent,
    EditorComponent
  ],
  imports: [
    PdfViewerModule,
    CommonModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MyMaterialModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      sanitize: SecurityContext.NONE,
      markedOptions: {
         provide: MarkedOptions,
         useFactory: markedOptionsFactory,
      },
   }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// if (typeof Worker !== 'undefined') {
//   // Create a new
//   const worker = new Worker('./app.worker', { type: 'module' });
//   worker.onmessage = ({ data }) => {
//     console.log(`page got message: ${data}`);
//   };
//   worker.postMessage('hello');
// } else {
//   // Web Workers are not supported in this environment.
//   // You should add a fallback so that your program still executes correctly.
// }