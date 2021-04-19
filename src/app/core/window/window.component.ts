import { ComponentRef, ComponentFactory, ComponentFactoryResolver, Input, AfterViewInit, OnDestroy} from '@angular/core';
import { Type } from '@angular/core';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { PdfViewerComponent } from 'src/app/bodies/pdf-viewer/pdf-viewer.component';
import { SvgViewerComponent } from 'src/app/bodies/svg-viewer/svg-viewer.component';
import { DefaultHeaderComponent } from 'src/app/headers/default-header/default-header.component';
import { BodyComponent } from '../contracts';


@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.sass']
})
export class WindowComponent implements OnInit, AfterViewInit, OnDestroy{

  public readonly windows = {
    "pdf": { body : PdfViewerComponent, header : DefaultHeaderComponent, icon:"🖨️", name : "PDF Viewer"},
    "svg": { body : SvgViewerComponent, header : DefaultHeaderComponent, icon:"🖼️", name : "Svg Viewer"}
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
}
