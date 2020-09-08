import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as monaco from 'monaco-editor';
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

  constructor(private readonly monacoService: MonacoService) {
    
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
}