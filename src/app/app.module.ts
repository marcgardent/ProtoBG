import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SecurityContext } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppComponent } from 'src/app/app.component';
import { DefinitionComponent } from 'src/app/modules/definition/definition.component';
import { ConfigurationComponent } from 'src/app/modules/configuration/configuration.component';
import { RenameComponent } from 'src/app/modals/rename/rename.component';
import { LayoutComponent } from 'src/app/layout/layout/layout.component';
import { TitlebarComponent } from 'src/app/layout/titlebar/titlebar.component';
import { WindowComponent } from 'src/app/layout/window/window.component';
import { AngularSplitModule } from 'angular-split';
import { DefaultHeaderComponent } from 'src/app/headers/default-header/default-header.component';
import { ExplorerComponent } from 'src/app/headers/explorer/explorer.component';
import { TagSelectorComponent } from 'src/app/headers/tag-selector/tag-selector.component';
import { markedOptionsFactory } from 'src/app/markedOptionFactory';
import { MyMaterialModule } from 'src/app/material/material.module';
import { BundleViewerComponent } from 'src/app/modules/bundle-viewer/bundle-viewer.component';
import { DebugViewerComponent } from 'src/app/modules/debug-viewer/debug-viewer.component';
import { EditorComponent } from 'src/app/modules/editor/editor.component';
import { GlyphsViewerComponent } from 'src/app/modules/glyphs-viewer/glyphs-viewer.component';
import { LearningViewerComponent } from 'src/app/modules/learning-viewer/learning-viewer.component';
import { SvgViewerComponent } from 'src/app/modules/svg-viewer/svg-viewer.component';
import { TextViewerComponent } from 'src/app/modules/text-viewer/text-viewer.component';
import { EventHubService } from 'src/app/services/eventhub.service';
import { FileSystemService } from 'src/app/services/file-system.service';
import { GlossaryService } from 'src/app/services/glossary.service';
import { LibraryService } from 'src/app/services/library.service';
import { MonacoService } from 'src/app/services/monaco.service';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { PrintableViewerComponent } from 'src/app/modules/pdf-viewer/printable-viewer.component';
 
@NgModule({
  declarations: [
    AppComponent,
    DefinitionComponent,
    ConfigurationComponent,
    RenameComponent,
    LayoutComponent,
    TitlebarComponent,
    WindowComponent,
    EditorComponent,
    ExplorerComponent,
    PrintableViewerComponent,
    TextViewerComponent,
    SvgViewerComponent,
    DefaultHeaderComponent,
    TagSelectorComponent,
    DebugViewerComponent,
    BundleViewerComponent,
    GlyphsViewerComponent,
    LearningViewerComponent
    ],
  entryComponents : [
    EditorComponent,
    ExplorerComponent,
    PrintableViewerComponent,
    TextViewerComponent,
    SvgViewerComponent,
    DefaultHeaderComponent,
    TagSelectorComponent,
    DebugViewerComponent,
    BundleViewerComponent,
    GlyphsViewerComponent,
    LearningViewerComponent
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
  bootstrap: [AppComponent],
  
})
export class AppModule { }
