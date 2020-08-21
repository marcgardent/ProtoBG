
# PAO for card game

## core concepts

.pao: Printing tags


.canvas: area
    .pao
    @have .width .height .margins .corners

.width: canvas' width
    .pao
    @accept .measure

.height: canvas' height
    .pao
    @accept .measure

.margins: canvas' margin
    .pao
    @accept .measure

.corners: radius corner of canvas 
    .pao
    @accept .measure

.measure: distance unit
    .pao
    .number
    .unit

.min: is min size of .canvas
    .pao
    @accept .measure

.max: is max size of .canvas
    .pao
    @accept .measure

.document: filled by canvas
    .pao

.orientation: orientation of pages composed by an .document
    .pao

.landscape: use .max size for the .page's width and .min size for .page's height 
    .orientation

.portrait: use .min size for the .page's width and .max size for .page's height
    .orientation

.page:
    .pao 
    @have .min .max

## definitions out of the box

.A4:
    it is a .page in A4 Format.
    .pao
    .page .min:210mm .max:297mm

.mm: millimeter
    size in .millimeter
    .pao .measure

.inch:
    size in inch
    .pao .measure

🃏magicsCard: Magic Card
    .canvas .width:68.mm .height:84.mm

.document:
    is collection of page filled by canvas

## Instance

.factory:
    @is .building    
    @produce = 10*[ 🧱raw ]
    @consume [🧰goods]
    @build 10🧱raw
    10*instances

.myCards:
    @is 🃏cardSheet
    @format 🃏magicsCard
    @document .A4 .portrait margin:10
    @print .factory:5
    @template @left:@consume @right:@produce @bottom:@build