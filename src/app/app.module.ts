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
import { DefinitionComponent } from './bodies/definition/definition.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EditorComponent } from './bodies/editor/editor.component';
import { ExplorerComponent } from './headers/explorer/explorer.component';
import { MonacoService } from './services/monaco.service';
import { WarehouseService } from './services/warehouse.service';
import { GlossaryService } from './services/glossary.service';
import { EventHubService } from './services/eventhub.service';
import { ConfigurationComponent } from './bodies/configuration/configuration.component';
import { RenameComponent } from './modals/rename/rename.component';
import { LayoutComponent } from './core/layout/layout.component';
import { TitlebarComponent } from './core/titlebar/titlebar.component';
import { FileSystemService } from './services/file-system.service';
import { AngularSplitModule } from 'angular-split';
import { LibraryService } from './services/library.service';
import { WindowComponent } from './core/window/window.component';
import { PdfViewerComponent } from './bodies/pdf-viewer/pdf-viewer.component';
import { TextViewerComponent } from './bodies/text-viewer/text-viewer.component';
import { SvgViewerComponent } from './bodies/svg-viewer/svg-viewer.component';
@NgModule({
  declarations: [
    AppComponent,
    DefinitionComponent,
    EditorComponent,
    ExplorerComponent,
    ConfigurationComponent,
    RenameComponent,
    LayoutComponent,
    TitlebarComponent,
    WindowComponent,
    PdfViewerComponent,
    TextViewerComponent,
    SvgViewerComponent
  ],
  imports: [
    AngularSplitModule,
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
  providers: [EventHubService, WarehouseService, GlossaryService, MonacoService, FileSystemService, LibraryService],
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