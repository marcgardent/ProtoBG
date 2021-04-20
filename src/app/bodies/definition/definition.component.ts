import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BodyComponent, ComponentBase } from 'src/app/core/contracts';

@Component({
  selector: 'app-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.less']
})
export class DefinitionComponent extends ComponentBase implements OnInit, OnDestroy, BodyComponent {

  constructor() { super();}
  link(header: any) {
    
  }

  @Input()
  public data:any;


  ngOnInit(): void {

  }
  
}