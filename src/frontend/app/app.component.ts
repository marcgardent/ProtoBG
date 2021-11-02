import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultBook } from 'src/core/library/library';
import { IBook } from 'src/core/models';
import { EventHubService } from 'src/frontend/app/services/eventhub.service';
import { FileSystemService } from 'src/frontend/app/services/file-system.service';
import { GlossaryService } from 'src/frontend/app/services/glossary.service';
import { LibraryService } from 'src/frontend/app/services/library.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  
  public books: Array<IBook> = new Array<IBook>();
  public currentBook = DefaultBook;

  constructor(private snackBar: MatSnackBar,
    private readonly glossaryService: GlossaryService,
    private readonly hub: EventHubService,
    public readonly fs: FileSystemService, private readonly libraryService: LibraryService) {
      
    this.hub.onSnackEntry.subscribe((m) => {
      this.snackBar.open(m, undefined, { duration: 4000 });
    });

    this.glossaryService.currentGlossary.subscribe((g) => {
    });

    this.glossaryService.runtimeError.subscribe((e) => {
    });

    this.glossaryService.reports.subscribe((r) => {
    });

    this.libraryService.onLibrary.subscribe((l) => {
      this.books = [...l.books.values()];
    });

  }

  ngOnInit(): void {

  }

  resize() {
    this.hub.resizeArea.next();
  }

  resizing() {
    this.hub.resizingArea.next();
  }

  @HostListener('window:keydown.control.r', ['$event'])
  refresh($event: KeyboardEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    window.location.reload();
  }
}
