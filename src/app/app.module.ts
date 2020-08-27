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
import { CodeEditorModule } from '@ngstack/code-editor';

@NgModule({
  declarations: [
    AppComponent,
    DefinitionComponent
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
    CodeEditorModule.forRoot(),
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