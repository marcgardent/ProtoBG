import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.sass']
})
export class TagSelectorComponent implements OnInit {

  @Input() public tag : any;
  @Output() public tagChange = new EventEmitter<any>();
  
  @Input() public tags : Array<any> = [];

  constructor() { }

  ngOnInit(): void {

  }

  selectTag(tag :any) {
    this.tag.next(tag);
  }
}