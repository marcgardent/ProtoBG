import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SecurityContext } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppComponent } from 'src/frontend/app/app.component';
import { DefinitionComponent } from 'src/frontend/app/modules/definition/definition.component';
import { ConfigurationComponent } from 'src/frontend/app/modules/configuration/configuration.component';
import { RenameComponent } from 'src/frontend/app/modals/rename/rename.component';
import { LayoutComponent } from 'src/frontend/app/layout/layout/layout.component';
import { TitlebarComponent } from 'src/frontend/app/layout/titlebar/titlebar.component';
import { WindowComponent } from 'src/frontend/app/layout/window/window.component';
import { AngularSplitModule } from 'angular-split';
import { DefaultHeaderComponent } from 'src/frontend/app/headers/default-header/default-header.component';
import { ExplorerComponent } from 'src/frontend/app/headers/explorer/explorer.component';
import { TagSelectorComponent } from 'src/frontend/app/headers/tag-selector/tag-selector.component';
import { markedOptionsFactory } from 'src/frontend/app/markedOptionFactory';
import { MyMaterialModule } from 'src/frontend/app/material/material.module';
import { BundleViewerComponent } from 'src/frontend/app/modules/bundle-viewer/bundle-viewer.component';
import { DebugViewerComponent } from 'src/frontend/app/modules/debug-viewer/debug-viewer.component';
import { EditorComponent } from 'src/frontend/app/modules/editor/editor.component';
import { GlyphsViewerComponent } from 'src/frontend/app/modules/glyphs-viewer/glyphs-viewer.component';
import { LearningViewerComponent } from 'src/frontend/app/modules/learning-viewer/learning-viewer.component';
import { SvgViewerComponent } from 'src/frontend/app/modules/svg-viewer/svg-viewer.component';
import { TextViewerComponent } from 'src/frontend/app/modules/text-viewer/text-viewer.component';
import { EventHubService } from 'src/frontend/app/services/eventhub.service';
import { FileSystemService } from 'src/frontend/app/services/file-system.service';
import { GlossaryService } from 'src/frontend/app/services/glossary.service';
import { LibraryService } from 'src/frontend/app/services/library.service';
import { MonacoService } from 'src/frontend/app/services/monaco.service';
import { WarehouseService } from 'src/frontend/app/services/warehouse.service';
import { PrintableViewerComponent } from 'src/frontend/app/modules/pdf-viewer/printable-viewer.component';
import { ConsoleComponent } from './modules/console/console.component';
 
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
    LearningViewerComponent,
    ConsoleComponent
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
    LearningViewerComponent,
    ConsoleComponent
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
