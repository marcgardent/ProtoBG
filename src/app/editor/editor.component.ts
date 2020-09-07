import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import * as monaco from 'monaco-editor'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {

  @ViewChild('editor', { static: true })
  editorContent: ElementRef<HTMLDivElement>;


  constructor() {

    (self as any).MonacoEnvironment = {
      getWorker: function (moduleId, label) {
        return new Worker('editor.worker.js');
      }
    }

  }

  ngOnInit(): void {

    monaco.editor.create(this.editorContent.nativeElement, {
      value: "function hello() {\n\talert('Hello world!');\n}",
      language: "javascript"
    });
  }

}
