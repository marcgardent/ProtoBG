
# ProtoBG

It's all-in-one ⚒️**tool** to create 🖼️**artworks** templated and published as 📄**PDF**.

> The main case is for the creation of playing 🃏cards. 

## overview

in order to generate your PDFs, you must write different definitions:

* Your model: write everything that you need to describe your subject 
* Your artwork templates: layout your graphics and data defined in the model.
* Your printing constraints: define your layout like margins, bleeds, corners, paper format...

Finally bind all together to export as a **PDF Document**

> in few words:  your data + template + printing constraints = PDF


with this tool you will learn to use different technologies:

* definitions in YAML: https://en.wikipedia.org/wiki/YAML
* artworks in SVG: https://www.w3schools.com/graphics/svg_intro.asp
* templating with Nunjucks(like jinja2): https://mozilla.github.io/nunjucks/
* documentation in Markdown (not implemented in the playground): https://guides.github.com/features/mastering-markdown/

Let's me explain in details the full pipeline.

## Your model

append entries in your glossary like this:

```yaml

💠name:
    title: entry's title
    description: |
        this is an description of entry.
    tags: 💠tag1 💠tag2 
    
```

## Your templates

```yaml

📐debugTemplate:
  tags: 📐nunjucks 
  📐definition: |
    &lt;svg xmlns="http://www.w3.org/2000/svg" 
    width="{{ width }}"
    height="{{ height }}" viewBox="0 0 {{ width }} {{ height }}">
      &lt;g id="bleedLayer" transform="translate({{bleedbox.x}}, {{bleedbox.y}})">
        &lt;rect id="bleedbox" x="0" y="0" width="{{bleedbox.width}}" height="{{bleedbox.height}}" fill="yellow"/>
      &lt;/g>
      &lt;g id="trimLayer" transform="translate({{trimbox.x}}, {{trimbox.y}})">
        &lt;rect id="trimbox" x="0" y="0" width="{{trimbox.width}}" height="{{trimbox.height}}" stroke-width="0.1"
            fill="lightgreen" rx="{{trimbox.corners}}" ry="{{trimbox.corners}}" stroke="red"/>
        &lt;text text-anchor="left" alignment-baseline="hanging" x="{{trimbox.corners}}" y="0" font-size="4" fill="red">
            trimbox
        &lt;/text>
      &lt;/g>
      &lt;g id="artLayer" transform="translate({{artbox.x}}, {{artbox.y}})">
        &lt;rect id="artbox" x="0" y="0" width="{{artbox.width}}" height="{{artbox.height}}" stroke-width="1" fill="green" />
        &lt;text style="font-family: sans-serif;font-size:10" text-anchor="middle" x="{{artbox.width/2}}" y="{{artbox.height/2}}" fill="darkgreen">
            artbox
        &lt;/text>
      &lt;/g>
    &lt;/svg>

```

## Your printing constraints

This is an example for Poker cards describe on https://printeurope.fr:

```yaml

⏹myLayout:
  tags: ⏹layout
  📄format: 🃏poker 
  🔄orientation: 🔄portrait
  📏paddings: 4📏mm
  📏bleeds: 2📏mm
  📏corners: 4📏mm

```

## Your printing

bind data and the template and the layout:

```yaml
📘myDeck:
    tags: 📘document 
    📑foreach:
        - { 📑is: 🏭factory, 🖨️copies: 10}
        - { 📑is: 🧰goods, 🖨️copies: 1}
    ⏹layout: ⏹myLayout
    📐template: 📐debugTemplate
    📐parameters:
      ⬛left: 📉consume
      ⬛right: 📈produce
      ⬛bottom: ⚒️build

```

and export in PDF:

```yaml
🖨️myPrinting: 
  tags: 🖨️printing
  📑foreach: { 📑is: 📘myDeck }
  🖨️mode: 🛑review
  📏density: 300📏dpi
  📏margins: 10📏mm  
  
```

Or assemble your artworks togethers:

```
🖨️myAssembly:
  tags: 🖨️assembly
  📑foreach: { 📑is: 📘myDeck }
  🖨️mode: 🚀production
  📄format: 📄A4
  ➕marks: ➕lines
  🔄orientation: 🔄landscape
  📏margins: 10📏mm 
  📏gutters: 5📏mm 
  📏density: 300📏dpi 
```
