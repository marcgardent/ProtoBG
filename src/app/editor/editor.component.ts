import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as monaco from 'monaco-editor'


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less']
})
export class EditorComponent implements OnInit {

  @ViewChild('editor', { static: true })
  editorContent: ElementRef<HTMLDivElement>;
  editor: monaco.editor.IStandaloneCodeEditor;

  constructor() {
    window["MonacoEnvironment"] = {
      getWorker: (moduleId, label) => {

        // editorWorkerService, javascript
        if (label == "editorWorkerService") {
          return new Worker("node_modules/monaco-editor/esm/vs/editor/editor.worker.js", { type: 'module' });
        }
        else {
          console.exception("unknown monaco worker", moduleId, label);
          throw ("not implemented");
        }
      }
    };
  }

  ngOnInit(): void {

    this.editor = monaco.editor.create(this.editorContent.nativeElement, {
      value: "# test",
      language: "markdown",
      contextmenu: true,
      minimap: { enabled: true },
      fontFamily: "game-icons, monospace"
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (this.editor) {
      this.editor.layout();
    }
  }
}