import { Component, OnInit, Input } from '@angular/core';
import { BodyComponent } from 'src/app/core/contracts';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.less']
})
export class DefinitionComponent implements OnInit, BodyComponent {

  constructor() { }
  link(header: any) {
    
  }

  @Input()
  public data:any;


  ngOnInit(): void {

  }
  
}