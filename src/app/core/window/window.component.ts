import { ComponentRef, ComponentFactory, ComponentFactoryResolver, Input, AfterViewInit, OnDestroy} from '@angular/core';
import { Type } from '@angular/core';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { EditorComponent } from 'src/app/bodies/editor/editor.component';
import { PdfViewerComponent } from 'src/app/bodies/pdf-viewer/pdf-viewer.component';
import { SvgViewerComponent } from 'src/app/bodies/svg-viewer/svg-viewer.component';
import { DefaultHeaderComponent } from 'src/app/headers/default-header/default-header.component';
import { ExplorerComponent } from 'src/app/headers/explorer/explorer.component';
import { BodyComponent } from '../contracts';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.sass']
})
export class WindowComponent implements OnInit, AfterViewInit, OnDestroy{

  public readonly windows = {
    "pdf": { body : PdfViewerComponent, header : DefaultHeaderComponent, icon:"🖨️", name : "PDF Viewer"},
    "svg": { body : SvgViewerComponent, header : DefaultHeaderComponent, icon:"🖼️", name : "Svg Viewer"},
    "txt": { body : EditorComponent, header : ExplorerComponent, icon:"📘", name : "Text Editor"}
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