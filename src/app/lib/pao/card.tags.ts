
/** auto generated */
export class PaoCards {

    public static CARD = "🃏card";
    public static CARDPRINTING = "🖨️cardPrinting";
    public static MAGICS = "🃏magics";
    public static POKER = "🃏poker";
    public static BRIDGE = "🃏bridge";
    public static TAROT = "🃏tarot";
    public static GRID = "🖨️grid";
    public static FULLBLEED = "🖨️fullBleed";
    public static REVIEW = "🖨️review";
    public static TEMPLATE = "📐template";
    public static DEFINITION = "📐definition";
    public static PARAMETERS = "📐parameters";
    public static CARDPROJECT = "📐cardProject";
    public static NUNJUCKS = "📐nunjucks";
    public static DEFAULTCARDTEMPLATE = "📐defaultCardTemplate";
    public static CANVAS = "⬜canvas";
    public static ABSTRACT = "💠abstract";


    public static metadata = {
        "🃏card": { "description": "is playing card", "tags": ["⬜canvas", "💠abstract"], "properties": "📏width 📏height", "name": "card", "icon": "🃏", "codeName": "CARD" },
        "🖨️cardPrinting": { "description": "is printing of cards \nattach 🖨️copies into the request 📑foreach\n", "tags": ["💠abstract"], "properties": "🃏card 📑foreach", "name": "cardPrinting", "icon": "🖨️", "codeName": "CARDPRINTING" },
        "🃏magics": { "title": "Magic card format", "tags": ["🃏card"], "📏width": "63.5📏mm", "📏height": "88.9📏mm", "name": "magics", "icon": "🃏", "codeName": "MAGICS" },
        "🃏poker": { "title": "poker card format", "tags": ["🃏card"], "📏width": "63📏mm", "📏height": "89📏mm", "name": "poker", "icon": "🃏", "codeName": "POKER" },
        "🃏bridge": { "title": "bridge card format", "tags": ["🃏card"], "📏width": "63📏mm", "📏height": "89📏mm", "name": "bridge", "icon": "🃏", "codeName": "BRIDGE" },
        "🃏tarot": { "title": "tarot card format", "tags": ["🃏card"], "📏width": "60📏mm", "📏height": "113📏mm", "name": "tarot", "icon": "🃏", "codeName": "TAROT" },
        "🖨️grid": { "tag": "🖨️cardPrinting", "name": "grid", "icon": "🖨️", "codeName": "GRID", "tags": [] },
        "🖨️fullBleed": { "title": "full-bleed", "description": "print one card by page without margins", "tag": "🖨️cardPrinting", "properties": "📏margins", "name": "fullBleed", "icon": "🖨️", "codeName": "FULLBLEED", "tags": [] },
        "🖨️review": { "description": "is 🖨️fullBleed but the 🖨️copies statements are ignored", "tag": "🖨️cardPrinting", "name": "review", "icon": "🖨️", "codeName": "REVIEW", "tags": [] },
        "📐template": { "description": "is reusable template", "properties": "📐definition", "name": "template", "icon": "📐", "codeName": "TEMPLATE", "tags": [] },
        "📐definition": { "description": "is definition of a template", "name": "definition", "icon": "📐", "codeName": "DEFINITION", "tags": [] },
        "📐parameters": { "title": "parameters for 📐template", "description": "it is custom map to define parameters for a 📐template", "name": "parameters", "icon": "📐", "codeName": "PARAMETERS", "tags": [] },
        "📐cardProject": { "description": "📑foreach 💠entry the process apply the 📐template  with 📐parameters.\ntherefore it generates collection of 🃏card.\n", "properties": "📐template 📐parameters 🃏card 📑foreach", "name": "cardProject", "icon": "📐", "codeName": "CARDPROJECT", "tags": [] },
        "📐nunjucks": { "description": "it's nunjucks template, see https://mozilla.github.io/nunjucks/", "tags": ["📐template"], "properties": "📐definition", "name": "nunjucks", "icon": "📐", "codeName": "NUNJUCKS" },
        "📐defaultCardTemplate": { "tags": ["📐nunjucks"], "📐definition": "{% set paddings = '📏paddings' | fromParameters | millimeter  %}\n{% set corners = '📏corners' | fromParameters | millimeter %}\n{% set width = '🃏card' | fromPrinting | fromGlossary | get('📏width') | millimeter  %}\n{% set height = '🃏card' | fromPrinting | fromGlossary | get('📏height') | millimeter  %}\n{% set contentCorners = corners /2  %}\n{% set contentWidth = width - (paddings*2)  %}\n{% set contentHeight = height - (paddings*2)  %}\n{% set contentHalfWidth = contentWidth/2  %}\n{% set contentHalfHeight = contentWidth/2  %}\n\n{% set lineHeight = 10  %}\n{% set fontSize = lineHeight-3  %}\n{% set title = 'name' | fromModel %}\n{% set icon = 'icon' | fromModel  %}\n\n<svg xmlns=\"http://www.w3.org/2000/svg\" \nwidth=\"{{ width }}\"\nheight=\"{{ height }}\" viewBox=\"0 0 {{ width }} {{ height }}\">\n  <rect x=\"0\" y=\"0\" width=\"{{width}}\" height=\"{{height}}\" rx=\"4\" ry=\"4\" fill=\"gray\"/>\n  <g id=\"content\" class=\"debug\" transform=\"translate({{paddings}}, {{paddings}})\">\n    <rect x=\"0\" y=\"0\"  width=\"{{contentWidth}}\" height=\"{{contentHeight}}\" rx=\"{{contentCorners}}\" ry=\"{{contentCorners}}\" fill=\"red\"\nstroke=\"green\" stroke-width=\"0\"/>\n    <rect id=\"title\" class=\"debug\" width=\"{{contentWidth}}\" height=\"{{lineHeight}}\" rx=\"{{contentCorners}}\" ry=\"{{contentCorners}}\" fill=\"green\"/>\n    <text text-anchor=\"middle\" x=\"{{contentHalfWidth}}\" y=\"{{fontSize}}\" font-size=\"{{fontSize}}\">\n        {{icon}}{{title}}\n    </text>\n  </g>\n</svg>\n", "name": "defaultCardTemplate", "icon": "📐", "codeName": "DEFAULTCARDTEMPLATE" },
        "⬜canvas": { "name": "canvas", "codeName": "CANVAS", "icon": "⬜", "description": "undefined entry!" },
        "💠abstract": { "name": "abstract", "codeName": "ABSTRACT", "icon": "💠", "description": "undefined entry!" },
    };
}

