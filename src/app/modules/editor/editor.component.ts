import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import * as monaco from 'monaco-editor';
import { BodyComponent, ComponentBase } from 'src/app/layout/contracts';
import { EventHubService } from 'src/app/services/eventhub.service';
import { MonacoService } from 'src/app/services/monaco.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  @ViewChild('editor', { static: true })
  editorContent: ElementRef<HTMLDivElement>;
  editor : monaco.editor.IStandaloneCodeEditor;
  public visible = true;

  constructor(private readonly monacoService: MonacoService, private readonly hub: EventHubService) {
    super();
    this.subUntilOnDestroy(this.hub.resizeArea, ()=>{ this.visible = true;this.onResize()});
    
  }

  link(header: any) {
    
  }

  ngOnInit(): void {
    this.editor = this.monacoService.createEditor(this.editorContent.nativeElement);
  }

  @HostListener('window:resize')
  onResize() {
    if (this.editor) {
      this.editor.layout();
    }
  }

  @HostListener('window:keydown.control.s', ['$event'])
  refresh($event: KeyboardEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.monacoService.rehydrateWorkspace();
  }
}