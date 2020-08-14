
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

.A4Portrait: is a .page in A4 Format, portrait oriented.
    @is .pao .page .width:210 .height:297 .margin:10 .mm

.A4Landscape: @is a .page in A4 Format, with Landscape oriented.
    @is .pao .page .width:297 .height:210 .margin:10 .mm

.mm: size in .millimeter
    @is .pao .measure

.inch: size in inch
    @is .pao .measure

.magicsCard:  
    @is .canvas .width:68 .height:84 .mm

.document: is collection of page filled by canvas

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