

/** auto generated */
export class Pao {

  public static PAO = "🖨️pao";
  public static CANVAS = "⬜canvas";
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
  public static GUNTER = "📏gunter";
  public static A4 = "📄A4";
  public static CARD = "🃏card";
  public static MAGICS = "🃏magics";
  public static POKER = "🃏poker";
  public static BRIDGE = "🃏bridge";
  public static TAROT = "🃏tarot";
  public static DOCUMENT = "📘document";
  public static PRINTING = "🖨️printing";
  public static MODE = "🖨️mode";
  public static PRODUCTION = "🚀production";
  public static REVIEW = "🛑review";
  public static BOX = "⬜box";
  public static MEDIABOX = "⬜mediaBox";
  public static BLEEDBOX = "⬜bleedBox";
  public static TRIMBOX = "⬜trimBox";
  public static ARTBOX = "⬜artBox";
  public static MARKS = "➕marks";
  public static MARGINS = "📏margins";
  public static BLEEDS = "📏bleeds";
  public static PADDINGS = "📏paddings";
  public static ABSTRACT = "💠abstract";
  public static PROPERTY = "💠property";
  public static OUTPUT = "📐output";


  public static metadata = {
   "🖨️pao" : {"title":"PAO namespace","name":"pao","icon":"🖨️","codeName":"PAO","tags":[]},
   "⬜canvas" : {"description":"is an rectangle to display something","tag":"🖨️pao 💠abstract","name":"canvas","icon":"⬜","codeName":"CANVAS","tags":[]},
   "📄format" : {"tags":["🖨️pao","⬜canvas","💠abstract"],"properties":"📏min 📏max","name":"format","icon":"📄","codeName":"FORMAT"},
   "📄page" : {"properties":"📄format 🔄orientation","name":"page","icon":"📄","codeName":"PAGE","tags":[]},
   "📏unit" : {"tags":["🖨️pao","💠property","💠abstract"],"name":"unit","icon":"📏","codeName":"UNIT"},
   "📏distance" : {"title":"distance unit","tags":["🖨️pao","📏unit","💠property","💠abstract"],"name":"distance","icon":"📏","codeName":"DISTANCE"},
   "📏density" : {"tags":["🖨️pao","📏unit","💠property","💠abstract"],"name":"density","icon":"📏","codeName":"DENSITY"},
   "🔄orientation" : {"description":"orientation of a 📄format","tags":["🖨️pao"],"name":"orientation","icon":"🔄","codeName":"ORIENTATION"},
   "🔄landscape" : {"description":"use .max size for the 📄format's width and .min size for 📄format's height","tags":["🔄orientation"],"name":"landscape","icon":"🔄","codeName":"LANDSCAPE"},
   "🔄portrait" : {"description":"use .min size for the 📄format's width and .max size for 📄format's height","tags":["🔄orientation"],"name":"portrait","icon":"🔄","codeName":"PORTRAIT"},
   "🖨️copies" : {"description":"quantity printed","tags":["🖨️pao"],"name":"copies","icon":"🖨️","codeName":"COPIES"},
   "📏mm" : {"alias":"millimeter","description":"📏distance in millimeter","tags":["🖨️pao","📏distance"],"name":"mm","icon":"📏","codeName":"MM"},
   "📏inch" : {"alias":"inches","description":"📏distance in inch","tags":["🖨️pao","📏distance"],"name":"inch","icon":"📏","codeName":"INCH"},
   "📏dpi" : {"tags":["🖨️pao","📏density"],"name":"dpi","icon":"📏","codeName":"DPI"},
   "📏width" : {"title":"⬜canvas' width","tags":["🖨️pao","📏distance","💠property"],"name":"width","icon":"📏","codeName":"WIDTH"},
   "📏height" : {"title":"⬜canvas' height","tags":["🖨️pao","📏distance","💠property"],"name":"height","icon":"📏","codeName":"HEIGHT"},
   "📏corners" : {"title":"radius corner of ⬜canvas","tags":["🖨️pao","📏distance","💠property"],"name":"corners","icon":"📏","codeName":"CORNERS"},
   "📏min" : {"title":"is min side of ⬜canvas","tags":["🖨️pao","📏distance","💠property"],"name":"min","icon":"📏","codeName":"MIN"},
   "📏max" : {"title":"is max side of ⬜canvas","tags":["🖨️pao","📏distance","💠property"],"name":"max","icon":"📏","codeName":"MAX"},
   "📏gunter" : {"description":"space between two ⬜canvas\n","tags":["🖨️pao","📏distance","💠property"],"name":"gunter","icon":"📏","codeName":"GUNTER"},
   "📄A4" : {"description":"it is a 📄format in A4 Format.","tags":["🖨️pao","📄format"],"📏min":"210📏mm","📏max":"297📏mm","name":"A4","icon":"📄","codeName":"A4"},
   "🃏card" : {"description":"is playing card","tags":["🖨️pao","📄format","💠abstract"],"name":"card","icon":"🃏","codeName":"CARD"},
   "🃏magics" : {"title":"Magic card format","tags":["🖨️pao","🃏card"],"📏min":"63.5📏mm","📏max":"88.9📏mm","name":"magics","icon":"🃏","codeName":"MAGICS"},
   "🃏poker" : {"title":"poker card format","tags":["🖨️pao","🃏card"],"📏min":"63📏mm","📏max":"89📏mm","name":"poker","icon":"🃏","codeName":"POKER"},
   "🃏bridge" : {"title":"bridge card format","tags":["🖨️pao","🃏card"],"📏min":"63📏mm","📏max":"89📏mm","name":"bridge","icon":"🃏","codeName":"BRIDGE"},
   "🃏tarot" : {"title":"tarot card format","tags":["🖨️pao","🃏card"],"📏min":"60📏mm","📏max":"113📏mm","name":"tarot","icon":"🃏","codeName":"TAROT"},
   "📘document" : {"description":"generate a collection of 📄pages with a 📐template \nattach 🖨️copies into the request 📑foreach\n","tags":["🖨️pao","📐output"],"properties":"📄format 🔄orientation 📏paddings 📏bleeds 📐template 📐parameters 📑foreach","name":"document","icon":"📘","codeName":"DOCUMENT"},
   "🖨️printing" : {"description":"print a collection of 📘document","properties":"📑foreach 🖨️mode 📏margins","tags":["🖨️pao"],"name":"printing","icon":"🖨️","codeName":"PRINTING"},
   "🖨️mode" : {"description":"printing behavior","tags":["🖨️pao"],"name":"mode","icon":"🖨️","codeName":"MODE"},
   "🚀production" : {"tag":"🖨️pao 🖨️mode","name":"production","icon":"🚀","codeName":"PRODUCTION","tags":[]},
   "🛑review" : {"description":"ignore 🖨️copies statement","tag":"🖨️pao 🖨️mode","name":"review","icon":"🛑","codeName":"REVIEW","tags":[]},
   "⬜box" : {"description":"⬜mediaBox > ⬜bleedBox > ⬜trimBox > ⬜artBox\n","name":"box","icon":"⬜","codeName":"BOX","tags":[]},
   "⬜mediaBox" : {"description":"the physical support","name":"mediaBox","icon":"⬜","codeName":"MEDIABOX","tags":[]},
   "⬜bleedBox" : {"description":"bleed","name":"bleedBox","icon":"⬜","codeName":"BLEEDBOX","tags":[]},
   "⬜trimBox" : {"description":"The ⬜trimBox defines the intended dimensions of the finished page","name":"trimBox","icon":"⬜","codeName":"TRIMBOX","tags":[]},
   "⬜artBox" : {"description":"safe zone","name":"artBox","icon":"⬜","codeName":"ARTBOX","tags":[]},
   "➕marks" : {"description":"trim marks","name":"marks","icon":"➕","codeName":"MARKS","tags":[]},
   "📏margins" : {"description":"space between ⬜mediaBox and ⬜bleedBox \nuse to add ➕marks and metadata.\n","tags":["🖨️pao","📏distance","💠property"],"name":"margins","icon":"📏","codeName":"MARGINS"},
   "📏bleeds" : {"description":"bleed is where printing goes all the way to the edge of the page. \nspace between ⬜bleedBox and ⬜trimBox\n","tags":["🖨️pao","📏distance","💠property"],"name":"bleeds","icon":"📏","codeName":"BLEEDS"},
   "📏paddings" : {"description":"space between ⬜trimBox ⬜artBox","tags":["🖨️pao","📏distance","💠property"],"name":"paddings","icon":"📏","codeName":"PADDINGS"},
   "💠abstract" : {"name":"abstract","codeName":"ABSTRACT","icon":"💠","description":"undefined entry!"},
   "💠property" : {"name":"property","codeName":"PROPERTY","icon":"💠","description":"undefined entry!"},
   "📐output" : {"name":"output","codeName":"OUTPUT","icon":"📐","description":"undefined entry!"},

  };
}

