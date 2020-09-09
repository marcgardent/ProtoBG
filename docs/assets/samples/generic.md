
📐myTemplate:
  tags: 📐nunjucks
  📐definition: |
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="{{ width }}"
    height="{{ height }}" viewBox="0 0 {{ width }} {{ height }}" >
      <g id="bleedLayer" transform="translate({{bleedbox.x}}, {{bleedbox.y}})">
        <rect id="bleedbox" x="0" y="0" width="{{bleedbox.width}}" height="{{bleedbox.height}}" fill="yellow"/>
      </g>
      <g id="trimLayer" transform="translate({{trimbox.x}}, {{trimbox.y}})">
        <rect id="trimbox" x="0" y="0" width="{{trimbox.width}}" height="{{trimbox.height}}" stroke-width="0.1"
            fill="lightgreen" rx="{{trimbox.corners}}" ry="{{trimbox.corners}}" stroke="red"/>
        <text text-anchor="left" alignment-baseline="hanging" x="{{trimbox.corners}}" y="0.8" font-size="3" fill="red">
            ⬜trimBox
        </text>
      </g>
      <g id="artLayer" transform="translate({{artbox.x}}, {{artbox.y}})">
        <rect id="artbox" x="0" y="0" width="{{artbox.width}}" height="{{artbox.height}}" stroke-width="1" fill="green" />
        <text style="font-family: sans-serif;font-size:10" x="{{artbox.width/2}}" y="{{artbox.height/2}}" text-anchor="middle" fill="darkgreen">
            ⬜artBox
        </text>
        <text style="font-family: sans-serif;font-size:8" x="{{artbox.width/2}}" y="{{artbox.height/2+12}}" text-anchor="middle" fill="black">
            {{ 'icon' | fromModel }} {{ 'name' | fromModel }}
        </text>
        <text style="font-family: sans-serif;font-size:5" x="{{artbox.width/2}}" y="{{artbox.height/2+20}}" text-anchor="middle" fill="black">
            {{ 'description' | fromModel }}
        </text>
                <text style="font-family: sans-serif;font-size:2" x="{{artbox.width/2}}" y="{{artbox.height/2+25}}" text-anchor="middle" fill="black">
            {{ '💠customData' | fromModel | dump }}
        </text>
      </g>
    </svg>

🃏myData:
  description: I'm the model
  💠customData:
    type: I'm complex (map)
    array : 
      - item1
      - item2

⏹myLayout:
  tags: ⏹layout
  📄format: 🃏poker
  🔄orientation: 🔄portrait
  📏paddings: 4📏mm
  📏bleeds: 4📏mm
  📏corners: 4📏mm

📐myBinding:
  tags: 📐output
  ⏹layout: ⏹myLayout
  📐template: 📐myTemplate
  📐parameters: {}
  📑foreach:
    - { 📑is: 🃏myData}

🖨️myPrint:
  tags: 🖨️printing
  📑foreach:
    - { 📑is: 📐myBinding, 🖨️copies: 10}
  🖨️mode: 🚀production
  📏margins: 10📏mm
  📏density: 300📏dpi