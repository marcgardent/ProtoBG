import { ComponentRef, ComponentFactory, ComponentFactoryResolver, Input, AfterViewInit, OnDestroy} from '@angular/core';
import { Type } from '@angular/core';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { DefaultHeaderComponent } from 'src/frontend/app/headers/default-header/default-header.component';
import { ExplorerComponent } from 'src/frontend/app/headers/explorer/explorer.component';
import { BodyComponent } from 'src/frontend/app/layout/contracts';
import { ConfigurationComponent } from 'src/frontend/app/modules/configuration/configuration.component';
import { DebugViewerComponent } from 'src/frontend/app/modules/debug-viewer/debug-viewer.component';
import { EditorComponent } from 'src/frontend/app/modules/editor/editor.component';
import { GlyphsViewerComponent } from 'src/frontend/app/modules/glyphs-viewer/glyphs-viewer.component';
import { LearningViewerComponent } from 'src/frontend/app/modules/learning-viewer/learning-viewer.component';
import { PrintableViewerComponent } from 'src/frontend/app/modules/pdf-viewer/printable-viewer.component';
import { SvgViewerComponent } from 'src/frontend/app/modules/svg-viewer/svg-viewer.component';
import { TextViewerComponent } from 'src/frontend/app/modules/text-viewer/text-viewer.component';


@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.sass']
})
export class WindowComponent implements OnInit, AfterViewInit, OnDestroy{

  public readonly windows = {
    "pdf-viewer": { body : PrintableViewerComponent, header : DefaultHeaderComponent, icon:"🖨️", name : "PDF Viewer"},
    "svg-viewer": { body : SvgViewerComponent, header : DefaultHeaderComponent, icon:"🖼️", name : "Svg Viewer"},
    "txt-viewer": { body : TextViewerComponent, header : DefaultHeaderComponent, icon:"📋", name : "Text Viewer"},
    "glyphs-viewer": { body : GlyphsViewerComponent, header : DefaultHeaderComponent, icon:"🔣", name : "Glyphs Viewer"},
    "debug-viewer": { body : DebugViewerComponent, header : DefaultHeaderComponent, icon:"🛑", name : "Report"}, 
    "conf-viewer": { body : ConfigurationComponent, header : DefaultHeaderComponent, icon:"⚙️", name : "Config"}, 
    "learning-viewer": { body : LearningViewerComponent, header : DefaultHeaderComponent, icon:"❔", name : "Help"}, 
        
    "txt-editor": { body : EditorComponent, header : ExplorerComponent, icon:"📘", name : "Text Editor"}
  }

  
  @Input()
  public src: string = "svg";

  public get srcAsWindow() {return this.windows[this.src]; }
  public get icon() : string{ return this.srcAsWindow.icon};
  public get name() : string { return this.srcAsWindow.name};

  @ViewChild("headerContainer", { read: ViewContainerRef }) headerContainer;
  @ViewChild("bodyContainer", { read: ViewContainerRef }) bodyContainer;

  private headerRef: ComponentRef<BodyComponent>;
  private bodyRef: ComponentRef<BodyComponent>;
  
  constructor(private resolver: ComponentFactoryResolver) { }
  
  ngOnInit(): void {
   
  }

  ngAfterViewInit(): void {
    this.instantiateWindow(this.srcAsWindow);
  }
  
  ngOnDestroy(): void {
    this.destroyWindow();
  }

  private destroyWindow(){
    if(this.bodyRef){ this.bodyRef.destroy(); }
    if(this.headerRef){ this.headerRef.destroy(); }
  }

  private instantiateWindow(window : any) {
    this.headerContainer.clear(); 
    this.bodyContainer.clear();
    this.headerRef = this.headerContainer.createComponent(this.resolver.resolveComponentFactory(window.header));
    this.bodyRef = this.bodyContainer.createComponent(this.resolver.resolveComponentFactory(window.body));
    this.bodyRef.instance.link(this.headerRef.instance);
  }

  public switch(name : string) : void {
    this.destroyWindow();
    this.src = name;
    this.instantiateWindow(this.srcAsWindow);
  }
}