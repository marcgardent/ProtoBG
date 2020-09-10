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
import { ExplorerComponent } from './explorer/explorer.component';
import { MonacoService } from './services/monaco.service';
import { WarehouseService } from './services/warehouse.service';
import { GlossaryService } from './services/glossary.service';
import { EventHubService } from './services/eventhub.service';
import { ConfigurationComponent } from './configuration/configuration.component';
import { RenameComponent } from './rename/rename.component';

@NgModule({
  declarations: [
    AppComponent,
    DefinitionComponent,
    EditorComponent,
    ExplorerComponent,
    ConfigurationComponent,
    RenameComponent
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
  providers: [EventHubService, WarehouseService, GlossaryService, MonacoService],
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