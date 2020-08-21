

/** auto generated */
export class Pao{

  public static PAO = "📐pao";
  public static CANVAS = "⬜canvas";
  public static WIDTH = "📏width";
  public static HEIGHT = "📏height";
  public static MARGINS = "📏margins";
  public static PADDINGS = "📏paddings";
  public static CORNERS = "📏corners";
  public static MEASURE = "📏measure";
  public static MIN = "📏min";
  public static MAX = "📏max";
  public static DOCUMENT = "📄document";
  public static ORIENTATION = "🔄orientation";
  public static LANDSCAPE = "🔄landscape";
  public static PORTRAIT = "🔄portrait";
  public static PAGE = "📄page";
  public static A4 = "📄A4";
  public static MM = "📏mm";
  public static INCH = "📏inch";
  public static CARD = "🃏card";
  public static MAGICS = "🃏magics";
  public static POKER = "🃏poker";
  public static BRIDGE = "🃏bridge";
  public static TAROT = "🃏tarot";
  public static BORDERS = "⬛borders";
  public static DEFAULTBORDERS = "⬛defaultBorders";
  public static DEFAULTCARDLAYOUT = "⬛defaultCardLayout";
  public static CARDSHEET = "📄cardsheet";
  public static DECK = "📄deck";
  public static FOR = "📑for";
  public static SLOT = "⬛slot";
  public static LEFT = "⬛left";
  public static RIGHT = "⬛right";
  public static BOTTOM = "⬛bottom";
  public static FORMAT = "⬜format";
  public static ABSTRACT = "💠abstract";
  public static PROPERTY = "💠property";
  public static UNIT = "📐unit";
  public static REQUEST = "📑request";


  public static metadata = {
   "📐pao" : {"title":"PAO namespace","name":"pao","icon":"📐","codeName":"PAO","tags":[]},
   "⬜canvas" : {"title":"area","tags":["📐pao","💠abstract"],"properties":"📏width 📏height 📏margins 📏corners 📏paddings","name":["💠abstract","💠","abstract"],"icon":"⬜","codeName":"CANVAS"},
   "📏width" : {"title":"canvas' width","tags":["📐pao","📏measure","💠property"],"name":["💠property","💠","property"],"icon":"📏","codeName":"WIDTH"},
   "📏height" : {"title":"canvas' height","tags":["📐pao","📏measure","💠property"],"name":"height","icon":"📏","codeName":"HEIGHT"},
   "📏margins" : {"title":"canvas' margin","tags":["📐pao","📏measure","💠property"],"name":"margins","icon":"📏","codeName":"MARGINS"},
   "📏paddings" : {"title":"canvas' paddings","tags":["📐pao","📏measure","💠property"],"name":"paddings","icon":"📏","codeName":"PADDINGS"},
   "📏corners" : {"title":"radius corner of canvas","tags":["📐pao","📏measure","💠property"],"name":"corners","icon":"📏","codeName":"CORNERS"},
   "📏measure" : {"title":"distance unit","tags":["📐pao","📐unit","💠property","💠abstract"],"name":["📐unit","📐","unit"],"icon":"📏","codeName":"MEASURE"},
   "📏min" : {"title":"is min size of ⬜canvas","tags":["📐pao","📏measure","💠property"],"name":"min","icon":"📏","codeName":"MIN"},
   "📏max" : {"title":"is max size of ⬜canvas","tags":["📐pao","📏measure","💠property"],"name":"max","icon":"📏","codeName":"MAX"},
   "📄document" : {"title":"filled by canvas","tags":["📐pao"],"name":"document","icon":"📄","codeName":"DOCUMENT"},
   "🔄orientation" : {"description":"orientation of a 📄page","tags":["📐pao"],"name":"orientation","icon":"🔄","codeName":"ORIENTATION"},
   "🔄landscape" : {"description":"use .max size for the 📄page's width and .min size for 📄page's height","tags":["🔄orientation"],"name":"landscape","icon":"🔄","codeName":"LANDSCAPE"},
   "🔄portrait" : {"description":"use .min size for the 📄page's width and .max size for 📄page's height","tags":["🔄orientation"],"name":"portrait","icon":"🔄","codeName":"PORTRAIT"},
   "📄page" : {"tags":["📐pao"],"properties":"📏min 📏max","name":"page","icon":"📄","codeName":"PAGE"},
   "📄A4" : {"description":"it is a 📄page in A4 Format.","tags":["📐pao","📄page"],"📏min":"210📏mm","📏max":"297📏mm","name":"A4","icon":"📄","codeName":"A4"},
   "📏mm" : {"alias":"millimeter","description":"📏measure in millimeter","tags":["📐pao","📏measure"],"name":"mm","icon":"📏","codeName":"MM"},
   "📏inch" : {"alias":"inches","description":"📏measure in inch","tags":["📐pao"],"name":"inch","icon":"📏","codeName":"INCH"},
   "🃏card" : {"description":"is standard canvas for playing card","tags":["💠abstract"],"name":"card","icon":"🃏","codeName":"CARD"},
   "🃏magics" : {"title":"Magic card format","tags":["🃏card"],"📏width":"63.5📏mm","📏height":"88.9📏mm","name":"magics","icon":"🃏","codeName":"MAGICS"},
   "🃏poker" : {"title":"poker card format","tags":["🃏card"],"📏width":"63📏mm","📏height":"89📏mm","name":"poker","icon":"🃏","codeName":"POKER"},
   "🃏bridge" : {"title":"bridge card format","tags":["🃏card"],"📏width":"63📏mm","📏height":"89📏mm","name":"bridge","icon":"🃏","codeName":"BRIDGE"},
   "🃏tarot" : {"title":"tarot card format","tags":["🃏card"],"📏width":"60📏mm","📏height":"113📏mm","name":"tarot","icon":"🃏","codeName":"TAROT"},
   "⬛borders" : {"tags":["💠abstract"],"properties":"📏paddings 📏margins 📏corners","name":"borders","icon":"⬛","codeName":"BORDERS"},
   "⬛defaultBorders" : {"tags":["⬛borders"],"📏paddings":"2📏mm","📏margins":"2📏mm","📏corners":"4📏mm","name":"defaultBorders","icon":"⬛","codeName":"DEFAULTBORDERS"},
   "⬛defaultCardLayout" : {"title":"card layout","description":"is generic card template","tags":["📐pao","💠abstract"],"properties":"⬛left ⬛right ⬛bottom 📑for ⬛borders 🃏card","name":"defaultCardLayout","icon":"⬛","codeName":"DEFAULTCARDLAYOUT"},
   "📄cardsheet" : {"tags":["📐pao","💠abstract","📄document"],"properties":"📑for 📄page 🔄orientation","name":"cardsheet","icon":"📄","codeName":"CARDSHEET"},
   "📄deck" : {"description":"only one card by page","tags":["📄document"],"properties":"📑for","name":"deck","icon":"📄","codeName":"DECK"},
   "📑for" : {"tags":["📑request"],"name":["📑request","📑","request"],"icon":"📑","codeName":"FOR"},
   "⬛slot" : {"tags":["💠abstract"],"name":"slot","icon":"⬛","codeName":"SLOT"},
   "⬛left" : {"tags":["⬛slot","💠property"],"name":"left","icon":"⬛","codeName":"LEFT"},
   "⬛right" : {"tags":["⬛slot","💠property"],"name":"right","icon":"⬛","codeName":"RIGHT"},
   "⬛bottom" : {"tags":["⬛slot","💠property"],"name":"bottom","icon":"⬛","codeName":"BOTTOM"},
   "⬜format" : {"tags":["⬜canvas","💠property"],"name":"format","icon":"⬜","codeName":"FORMAT"},
   "💠abstract" : {"name":"abstract","codeName":"ABSTRACT","icon":"💠","description":"undefined entry!"},
   "💠property" : {"name":"property","codeName":"PROPERTY","icon":"💠","description":"undefined entry!"},
   "📐unit" : {"name":"unit","codeName":"UNIT","icon":"📐","description":"undefined entry!"},
   "📑request" : {"name":"request","codeName":"REQUEST","icon":"📑","description":"undefined entry!"},

  };
}

