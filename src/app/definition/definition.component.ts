import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.less']
})
export class DefinitionComponent implements OnInit {

  constructor() { }

  @Input()
  public data:any;


  ngOnInit(): void {

  }
  
}
