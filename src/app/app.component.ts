import { Component } from '@angular/core';
import { readGlossaryFromMarkdown } from './TokenBlock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public definitions = [];

  public process() {
    const ret = readGlossaryFromMarkdown(this.content);
    this.definitions = ret;
    console.debug(ret);
  }

public content: string = `

# PAO for card game

## core concepts

@is: define a concept
.pao: Printing tags

.canvas: card define with .width .height .margin .measure
    @is .pao

.width: canvas' width
    @is .pao

.height: canvas' height
    @is .pao

.margin: canvas' margin
    @is .pao

.corners: radius corner of canvas 
    @is .pao

.measure:
    @is .pao

.document: filled by canvas
    @is .pao

## definitions out of the box

.A4Portrait:
    tt is a .page in A4 Format, portrait oriented.
    @is .pao .page .width:210 .height:297 .margin:10 .mm

.A4Landscape:
    it is a .page in A4 Format, with Landscape oriented.
    @is .pao .page .width:297 .height:210 .margin:10 .mm

.mm: millimeter
    size in .millimeter
    @is .pao .measure

.inch:
    size in inch
    @is .pao .measure

.magicsCard: Magic Card
    @is .canvas .width:68 .height:84 .mm

.document:
    is collection of page filled by canvas

## Instance

.factory:
    @produce .raw:10
    @consume .goods:5
    @build .raw:10

.mySheet:
    @is .document .A4Portrait
    @print .factory:5
    @left @consume
    @right @produce
    @bottom @build
`

public contentTest: string = `
# test

.tagFull: title
  description
  .tagging

.tagDesc: title
  .tagging

.tagDesc:
  desc
  
.tagShortTagged:
  .tagging

.tagMin: title
  .tagging

.tagTitle: title

.tagShortest:
.tagMin2:
`
}