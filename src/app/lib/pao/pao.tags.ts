

/** auto generated */
export class Pao {
  public static PAO = "🖨️pao";
  public static RECTANGLE = "⬜rectangle";
  public static FORMAT = "📄format";
  public static PAGE = "📄page";
  public static UNIT = "📏unit";
  public static DISTANCE = "📏distance";
  public static DENSITY = "📏density";
  public static ORIENTATION = "🔄orientation";
  public static LANDSCAPE = "🔄landscape";
  public static PORTRAIT = "🔄portrait";
  public static COPIES = "🖨️copies";
  public static MM = "📏mm";
  public static INCH = "📏inch";
  public static DPI = "📏dpi";
  public static WIDTH = "📏width";
  public static HEIGHT = "📏height";
  public static CORNERS = "📏corners";
  public static MIN = "📏min";
  public static MAX = "📏max";
  public static GUTTERS = "📏gutters";
  public static A4 = "📄A4";
  public static MAGICS = "🃏magics";
  public static POKER = "🃏poker";
  public static BRIDGE = "🃏bridge";
  public static TAROT = "🃏tarot";
  public static LAYOUT = "⏹layout";
  public static ARTWORK = "🖼️artwork";
  public static COLLECTION = "🖼️collection";
  public static PRINTING = "🖨️printing";
  public static ASSEMBLING = "🖨️assembling";
  public static MODE = "🖨️mode";
  public static PRODUCTION = "🚀production";
  public static REVIEW = "🛑review";
  public static MEDIABOX = "⬜mediaBox";
  public static BLEEDBOX = "⬜bleedBox";
  public static TRIMBOX = "⬜trimBox";
  public static ARTBOX = "⬜artBox";
  public static MARKS = "➕marks";
  public static LINES = "➕lines";
  public static CROSS = "➕cross";
  public static MARGINS = "📏margins";
  public static BLEEDS = "📏bleeds";
  public static PADDINGS = "📏paddings";
  public static ABSTRACT = "💠abstract";
  public static PROPERTY = "💠property";


  public static metadata = {
    "🖨️pao": { "title": "PAO namespace", "name": "pao", "icon": "🖨️", "codeName": "PAO", "tags": [] },
    "⬜rectangle": { "description": "is an rectangle to display something", "tags": ["🖨️pao", "💠abstract"], "name": "rectangle", "icon": "⬜", "codeName": "RECTANGLE" },
    "📄format": { "tags": ["🖨️pao", "💠abstract"], "properties": "📏min 📏max", "name": "format", "icon": "📄", "codeName": "FORMAT" },
    "📄page": { "tags": ["🖨️pao", "⬜rectangle"], "name": "page", "icon": "📄", "codeName": "PAGE" },
    "📏unit": { "tags": ["🖨️pao", "💠property", "💠abstract"], "name": "unit", "icon": "📏", "codeName": "UNIT" },
    "📏distance": { "tags": ["🖨️pao", "📏unit", "💠property", "💠abstract"], "title": "distance unit", "name": "distance", "icon": "📏", "codeName": "DISTANCE" },
    "📏density": { "tags": ["🖨️pao", "📏unit", "💠property", "💠abstract"], "name": "density", "icon": "📏", "codeName": "DENSITY" },
    "🔄orientation": { "tags": ["🖨️pao"], "description": "orientation of a 📄format", "name": "orientation", "icon": "🔄", "codeName": "ORIENTATION" },
    "🔄landscape": { "tags": ["🔄orientation"], "description": "use .max size for the 📄format's width and .min size for 📄format's height", "name": "landscape", "icon": "🔄", "codeName": "LANDSCAPE" },
    "🔄portrait": { "tags": ["🔄orientation"], "description": "use .min size for the 📄format's width and .max size for 📄format's height", "name": "portrait", "icon": "🔄", "codeName": "PORTRAIT" },
    "🖨️copies": { "tags": ["🖨️pao"], "description": "quantity printed", "name": "copies", "icon": "🖨️", "codeName": "COPIES" },
    "📏mm": { "tags": ["🖨️pao", "📏distance"], "alias": "millimeter", "description": "📏distance in millimeter", "name": "mm", "icon": "📏", "codeName": "MM" },
    "📏inch": { "alias": "inches", "description": "📏distance in inch", "tags": ["🖨️pao", "📏distance"], "name": "inch", "icon": "📏", "codeName": "INCH" },
    "📏dpi": { "tags": ["🖨️pao", "📏density"], "name": "dpi", "icon": "📏", "codeName": "DPI" },
    "📏width": { "title": "⬜rectangle's width", "tags": ["🖨️pao", "📏distance", "💠property"], "name": "width", "icon": "📏", "codeName": "WIDTH" },
    "📏height": { "title": "⬜rectangle's height", "tags": ["🖨️pao", "📏distance", "💠property"], "name": "height", "icon": "📏", "codeName": "HEIGHT" },
    "📏corners": { "tags": ["🖨️pao", "📏distance", "💠property"], "title": "radius corner of ⬜rectangle", "name": "corners", "icon": "📏", "codeName": "CORNERS" },
    "📏min": { "tags": ["🖨️pao", "📏distance", "💠property"], "title": "is min side of ⬜rectangle", "name": "min", "icon": "📏", "codeName": "MIN" },
    "📏max": { "tags": ["🖨️pao", "📏distance", "💠property"], "title": "is max side of ⬜rectangle", "name": "max", "icon": "📏", "codeName": "MAX" },
    "📏gutters": { "tags": ["🖨️pao", "📏distance", "💠property"], "description": "is layouting property to define the space between two ⬜rectangle\n", "name": "gutters", "icon": "📏", "codeName": "GUTTERS" },
    "📄A4": { "tags": ["🖨️pao", "📄format"], "description": "is standart A4 📄format.", "📏min": "210📏mm", "📏max": "297📏mm", "name": "A4", "icon": "📄", "codeName": "A4" },
    "🃏magics": { "tags": ["🖨️pao", "📄format"], "title": "Magic card 📄format", "📏min": "63.5📏mm", "📏max": "88.9📏mm", "name": "magics", "icon": "🃏", "codeName": "MAGICS" },
    "🃏poker": { "tags": ["🖨️pao", "📄format"], "title": "poker card 📄format", "📏min": "63📏mm", "📏max": "89📏mm", "name": "poker", "icon": "🃏", "codeName": "POKER" },
    "🃏bridge": { "tags": ["🖨️pao", "📄format"], "title": "bridge card 📄format", "📏min": "63📏mm", "📏max": "89📏mm", "name": "bridge", "icon": "🃏", "codeName": "BRIDGE" },
    "🃏tarot": { "tags": ["🖨️pao", "📄format"], "title": "tarot card 📄format", "📏min": "60📏mm", "📏max": "113📏mm", "name": "tarot", "icon": "🃏", "codeName": "TAROT" },
    "⏹layout": { "tags": ["🖨️pao", "💠property"], "description": "define layouting properties for an 🖼️artwork.\n", "properties": "📄format 🔄orientation 📏paddings 📏bleeds 📏corners", "name": "layout", "icon": "⏹", "codeName": "LAYOUT" },
    "🖼️artwork": { "tags": ["🖨️pao", "⬜rectangle"], "description": "is a picture produce when the 📐template is applied.\n", "name": "artwork", "icon": "🖼️", "codeName": "ARTWORK" },
    "🖼️collection": { "tags": ["🖨️pao"], "description": "is a collection of fullbleed 🖼️artwork.\n\nfor each entry of 📑foreach request, it produce one 🖼️artwork.\nthe 📐template is applied with the entry (akka model) and ⏹layout and 📐parameters\n\n> you have to implement ⏹layout constraint into your 📐template (⬜trimBox and ⬜bleedBox and 📄format)\n\nYou can attach the quantities of 🖨️copies into the 📑foreach request:\n\n```yaml\n📑foreach: { 📑is: 🏭factory, 🖨️copies: 10}\n```  \n", "properties": "⏹layout 📐template 📐parameters 📑foreach", "name": "collection", "icon": "🖼️", "codeName": "COLLECTION" },
    "🖨️printing": { "tags": ["🖨️pao"], "description": "print all 🖼️artwork of 🖼️collections defined by the 📑foreach request.\nIt prints one 🖼️artwork by 📄page into the PDF.\n", "properties": "📏margins 📏density 🖨️mode 📑foreach", "name": "printing", "icon": "🖨️", "codeName": "PRINTING" },
    "🖨️assembling": { "tags": ["🖨️pao"], "description": "print all 🖼️artwork of 🖼️collections defined by the 📑foreach request.\nit prints multiple 🖼️artworks by page as much as possible with the contrainsts (📄format, 📏gutters,📏margins).\n", "properties": "📄format 🔄orientation 📏density 📏margins 📏gutters 🖨️mode 📑foreach", "name": "assembling", "icon": "🖨️", "codeName": "ASSEMBLING" },
    "🖨️mode": { "tags": ["🖨️pao"], "description": "printing behavior", "name": "mode", "icon": "🖨️", "codeName": "MODE" },
    "🚀production": { "description": "print all 🖨️copies", "tags": ["🖨️pao", "🖨️mode"], "name": "production", "icon": "🚀", "codeName": "PRODUCTION" },
    "🛑review": { "description": "ignore the 🖨️copies statement\n\n> this is useful for reviewing one copy of each 🖼️artwork\n", "tags": ["🖨️pao", "🖨️mode"], "name": "review", "icon": "🛑", "codeName": "REVIEW" },
    "⬜mediaBox": { "tags": ["🖨️pao", "⬜rectangle"], "description": "the physical support\n\n> it's contains in order: ⬜bleedBox, ⬜trimBox, ⬜artBox\n", "name": "mediaBox", "icon": "⬜", "codeName": "MEDIABOX" },
    "⬜bleedBox": { "tags": ["🖨️pao", "⬜rectangle"], "description": "This is an ⬜rectangle greater than finished page\nbut you have to fill with your background.\n\n> it's contains in order: ⬜trimBox, ⬜artBox\n", "name": "bleedBox", "icon": "⬜", "codeName": "BLEEDBOX" },
    "⬜trimBox": { "tags": ["🖨️pao", "⬜rectangle"], "description": "It defines the intended dimensions of the finished page.\n\n> it's contains ⬜artBox.\n", "name": "trimBox", "icon": "⬜", "codeName": "TRIMBOX" },
    "⬜artBox": { "tags": ["🖨️pao", "⬜rectangle"], "description": "print important content only in this ⬜rectangle.\n", "name": "artBox", "icon": "⬜", "codeName": "ARTBOX" },
    "➕marks": { "description": "trim marks", "name": "marks", "icon": "➕", "codeName": "MARKS", "tags": [] },
    "➕lines": { "tags": ["➕marks"], "description": "trim marks for production.\nit's useful with 📏gutters and 📏bleeds.\n", "name": "lines", "icon": "➕", "codeName": "LINES" },
    "➕cross": { "description": "Trim marks added on each corner.\nThis save papers and trimming time.\nBut don't forget to implement 📏corners.\n", "tags": ["➕marks"], "name": "cross", "icon": "➕", "codeName": "CROSS" },
    "📏margins": { "tags": ["🖨️pao", "📏distance", "💠property"], "description": "distance between ⬜mediaBox and ⬜bleedBox \nuse to add ➕marks and metadata.\n", "name": "margins", "icon": "📏", "codeName": "MARGINS" },
    "📏bleeds": { "tags": ["🖨️pao", "📏distance", "💠property"], "description": "distance between ⬜bleedBox and ⬜trimBox.\n", "name": "bleeds", "icon": "📏", "codeName": "BLEEDS" },
    "📏paddings": { "tags": ["🖨️pao", "📏distance", "💠property"], "description": "distance between ⬜trimBox ⬜artBox.", "name": "paddings", "icon": "📏", "codeName": "PADDINGS" },
    "💠abstract": { "name": "abstract", "codeName": "ABSTRACT", "icon": "💠", "description": "undefined entry!" },
    "💠property": { "name": "property", "codeName": "PROPERTY", "icon": "💠", "description": "undefined entry!" },

  };

}

