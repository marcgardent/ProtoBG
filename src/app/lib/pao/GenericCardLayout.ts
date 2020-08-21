import * as nunjucks from 'nunjucks';
import { Glossary } from '../tags/Glossary';
import { Pao } from './pao.tags';
import { TagExpression } from '../tags/TagExpression';
// import template from './GenericCardLayout.njk';

const template = `
{% set paddings = '⬛borders' |fromLayout | fromGlossary | get('📏paddings') | millimeter  %}
{% set corners = '⬛borders' |fromLayout | fromGlossary | get('📏corners') | millimeter %}
{% set width = '🃏card' |fromLayout | fromGlossary | get('📏width') | millimeter  %}
{% set height = '🃏card' |fromLayout | fromGlossary | get('📏height') | millimeter  %}
{% set contentCorners = corners/2  %}
{% set contentWidth = width - (paddings*2)  %}
{% set contentHeight = height - (paddings*2)  %}
{% set contentHalfWidth = contentWidth/2  %}
{% set contentHalfHeight = contentWidth/2  %}

{% set lineHeight = 10  %}
{% set fontSize = lineHeight-3  %}
{% set title = 'name' |fromMe %}
{% set icon = 'icon' |fromMe  %}

<svg xmlns="http://www.w3.org/2000/svg" 
width="{{ width }}"
height="{{ height }}" viewBox="0 0 {{ width }} {{ height }}">
  <rect x="0" y="0" width="{{width}}" height="{{height}}" rx="4" ry="4" fill="gray"/>
  <g id="content" class="debug" transform="translate({{paddings}}, {{paddings}})">
    <rect x="0" y="0"  width="{{contentWidth}}" height="{{contentHeight}}" rx="{{contentCorners}}" ry="{{contentCorners}}" fill="red"
stroke="green" stroke-width="0"/>
    <rect id="title" class="debug" width="{{contentWidth}}" height="{{lineHeight}}" rx="{{contentCorners}}" ry="{{contentCorners}}" fill="green"/>
    <text text-anchor="middle" x="{{contentHalfWidth}}" y="{{fontSize}}" font-size="{{fontSize}}">
        {{icon}}{{title}}
    </text>
  </g>
</svg>
`

// 
// <!--
// paddings={{paddings}}
// corners={{corners}}
// width={{width}}
// height={{height}}
// contentWidth={{contentWidth}}
// contentHeight={{contentHeight}}
// -->

export class GenericCardLayout {

    constructor(private readonly glossary: Glossary, private readonly reader: TagExpression) {
        const myData = glossary.get(Pao.DEFAULTCARDLAYOUT);
    }

    public toSvg(layout: any): {content:string, quantity:number}[] {
        const ret = new Array();
        const sources = this.reader.resolveRequestsAt(layout, Pao.FOR);
        for (let source of sources) {
            const card = this.apply(layout, source.result);
            const quantity = this.reader.coalesce(parseInt(source.request["📐instances"]), 1);
            ret.push({content: card, quantity: quantity})
        }
        return ret;
    }

    private apply(layout: any, me: any) {
        var env = new nunjucks.Environment();
        const self = this;

        env.addFilter('fromLayout', function (key) {

            return layout[key];
        });

        env.addFilter('fromMe', function (key) {

            return me[key];
        });

        env.addFilter('fromGlossary', function (key) {
            return self.glossary.get(key);
        });

        env.addFilter('get', function (dict, key) {
            return dict[key];
        });

        env.addFilter('quantity', function (exp) {
            return self.reader.quantityOf(exp);
        });

        env.addFilter('millimeter', function (exp) {
            return self.reader.quantityOf(exp).value;
        });

        return env.renderString(template, layout);
    }
}