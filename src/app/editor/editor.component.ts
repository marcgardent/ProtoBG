import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as monaco from 'monaco-editor';
import { EventHubService } from '../services/eventhub.service';
import { MonacoService } from '../services/monaco.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {

  @ViewChild('editor', { static: true })
  editorContent: ElementRef<HTMLDivElement>;
  editor : monaco.editor.IStandaloneCodeEditor;
  public visible = true;

  constructor(private readonly monacoService: MonacoService, private readonly hub: EventHubService) {
    //this.hub.resizingArea.subscribe(()=>{ this.visible = false;});
    this.hub.resizeArea.subscribe(()=>{ this.visible = true;this.onResize()});
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