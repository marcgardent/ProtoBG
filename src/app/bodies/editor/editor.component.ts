import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import * as monaco from 'monaco-editor';
import { BodyComponent, ComponentBase } from 'src/app/core/contracts';
import { EventHubService } from '../../services/eventhub.service';
import { MonacoService } from '../../services/monaco.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
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