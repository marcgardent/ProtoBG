
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
🏠myCard:
  title: my emoji

myGlyph:
    title: my game icon
```

## Your templates

```yaml

📐myTemplate:
  tags: 📐nunjucks
  📐extension: svg
  📐definition: |
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="{{ width }}"
    height="{{ height }}" viewBox="0 0 {{ width }} {{ height }}" >
     <style>
        /* <![CDATA[ */
        @font-face {
            font-family: "game-icons";
            src: url('{{ './assets/game-icons.woff' | includeAsDataUri }}') format('woff');
        }
        /* ]]> */
      </style>
      <g id="bleedLayer" transform="translate({{bleedbox.x}}, {{bleedbox.y}})">
        <rect fill="black" id="bleedbox" x="0" y="0" width="{{bleedbox.width}}" height="{{bleedbox.height}}"/>
      </g>
      <g id="trimLayer" transform="translate({{trimbox.x}}, {{trimbox.y}})">
        <rect id="trimbox" x="0" y="0" width="{{trimbox.width}}" height="{{trimbox.height}}"
            fill="black" rx="{{trimbox.corners}}" ry="{{trimbox.corners}}"/>
      </g>
      <g id="artLayer" transform="translate({{artbox.x}}, {{artbox.y}})">
        <rect id="artbox" x="0" y="0" width="{{artbox.width}}" height="{{artbox.height}}"
        rx="{{trimbox.corners}}" ry="{{trimbox.corners}}" fill="lightgray" />
        <text style="font-family: game-icons;font-size:15" x="{{artbox.width/2}}" y="{{artbox.height/2}}" text-anchor="middle">
            {{ 'icon' | fromModel }}
        </text>
        <text style="font: small-caps bold 8px sans-serif" x="{{artbox.width/2}}" y="{{artbox.height/2+12}}" text-anchor="middle" fill="black">
            {{ 'title' | fromModel }}
        </text>
      </g>
    </svg>
```

## Your printing constraints

This is an example for Poker cards describe on https://printeurope.fr:

```yaml

⏹myLayout: 
  tags: ⏹layout
  📄format: 🃏poker 
  🔄orientation: 🔄portrait
  📏paddings: 4📏mm
  📏bleeds: 0📏mm
  📏corners: 4📏mm

```

## Your printing

bind data and the template and the layout:

```yaml
🖼️myCollection:
  tags: 🖼️collection
  ⏹layout: ⏹myLayout
  📐template: 📐myTemplate
  📐parameters: {}
  📑foreach:
    - { 📑is: 🏠myCard, 🖨️copies: 1}
    - { 📑is: myGlyph, 🖨️copies: 3}

```

and export in PDF:

```yaml
🖨️myPrinting:
  tags: 🖨️printing
  📑foreach:
    - { 📑is: 🖼️myCollection}
  🖨️mode: 🚀production
  📏margins: 0📏mm
  📏density: 300📏dpi
  
```
