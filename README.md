
# Datadoc

Build your data/documentation with a tag system and exploit it in data driven app!

> Data is documentation and documentation is data.

### Why

in order to write unambiguous documentation:

  * Use the same word for the same concept
  * Define each *concept* in the *glossary*
  * Organize your *concepts* with a tag system

in order to maximize the coherence between doc and your app: 
  * Exploit the *glossary* like a database for your application (data driven)

### What

* Write your datadoc in Markdown augmented
* Export datadoc as wellformed documentation in HTML/PDF
* Export datadoc as *Json*

### How

write your data/documentation in markdown

## Show cases


#### usage


#### full example

```

.resource:

.goods:
    @is .resource

.raw:
    @is .resource

.action: triggered by the player

@consume:
    move resources from your #hand to your #trash
    @is #rule
    @when @activate
    
@produce:
    move resources from the #bank to your #trash
    @is #rule
    @when @activate

@build:
    move the card from the #bank to your #trash
    and move resources from your #hand to your #trash   
    #rule

.building: 
    when you @activate, then resolve @consume and @produce
     
.workbench:
    @is .building
    
    @consume .raw:1 .worker:1
    @produce .goods:1
    @build .raw:3 .worker:1

.factory:
    @is .building
    @consume .raw:10 .worker:2
    @produce .goods:5
    @build .goods:10 .worker:1

.worker:

.mySheet:
    @is .document .A4Portrait
    @print .worker:10 .factory:5 .workbench:5
    @left @consume
    @right @produce
    @bottom @build
```

#### citybuilder

# City builder

## core concept 1D Engine

cards provide 4 kinds of action:

* .hobby able major to gain .happiness to develop your city.
* .work able citizens to gain time to do more activities. 
* .move able citizens to gain time to go more places.
* .build able the major to spend .happiness for infrastructure. Or income new .citizen.

* for each turn you start with .move:3 .activity:1
* The game is ended when the .bank haven't got citizens.
* the player with more citizens win!

But the major (you) fight against side effects:

* every actions produce side effects.
* side effects is useless card in your deck.

And the second struggle is event:

* sometime, an action trigger an event
* event can be canceled by .policy
* You choose one .policy at begin and .vote during the game

pipeline:

    .move -> .activity
    .activity -> .move
    .activity -> .happiness
    .happiness -> .card
    .happiness -> citizen

Main pipeline

    .move -> .activity -> .happiness -> citizen

## Hidden cost

.tax:
.jumpTraffic:

## resources

## hobby

## work

## move

.move:
    take one in your .cityStack.

.car:
    @provide .move:4 .jumpTraffic
    @trigger .transport+1

.bike:
    @provide .move:2
    @discard .jumpTraffic+1
    @trigger .transport+1

.metro:
    @provide .move .tax
    @discard .jumpTraffic+2
    @trigger .transport+1

## Transport Event

.transportStack:
    @is eventStack

.transportEvent:
    @is event

.upkeep:
    @is .transportEvent
    @provide .sadness
    @for .bike .car .metro

.serviceDown:
    @is .transportEvent
    @provide .sadness .strike
    @for .bike .car .metro

.sunlight:
    @is .transportEvent
    @provide .happiness
    @for .bike

.rain:
    @provide .sadness
    @is .transportEvent
    @for .bike

## Engine

> is generic rules reused

.event:
    @is .card

.eventStack: 
    is lottery of events happened when you use something.
    therefore, shuffle **all** .event and get and resolve immediately the .event.
    @is .stack

### Boardgame

* Create Cardsheets from datadoc
* Publish rules


## Field Engine 2D Engine

### basics

.build: add card on the board
.activate: 
.move: ...
.
.....