

/** auto generated */
export class Pao{

  public static PAO = "🖨️pao";
  public static CANVAS = "⬜canvas";
  public static FORMAT = "📄format";
  public static PAGE = "📄page";
  public static UNIT = "📏unit";
  public static DISTANCE = "📏distance";
  public static ORIENTATION = "🔄orientation";
  public static LANDSCAPE = "🔄landscape";
  public static PORTRAIT = "🔄portrait";
  public static COPIES = "🖨️copies";
  public static MM = "📏mm";
  public static INCH = "📏inch";
  public static DPI = "📏dpi";
  public static WIDTH = "📏width";
  public static HEIGHT = "📏height";
  public static MARGINS = "📏margins";
  public static BLEED = "📏bleed";
  public static PADDING = "📏padding";
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
  public static ASSEMBLY = "🖨️assembly";
  public static MODE = "🖨️mode";
  public static PRODUCTION = "🚀production";
  public static REVIEW = "🛑review";
  public static ABSTRACT = "💠abstract";
  public static PROPERTY = "💠property";
  public static OUTPUT = "📐output";
  public static DENSITY = "📏density";
  
  public static metadata = {
   "🖨️pao" : {"title":"PAO namespace","name":"pao","icon":"🖨️","codeName":"PAO","tags":[]},
   "⬜canvas" : {"description":"is an rectangle to display something","tag":"🖨️pao 💠abstract","name":"canvas","icon":"⬜","codeName":"CANVAS","tags":[]},
   "📄format" : {"tags":["🖨️pao","⬜canvas","💠abstract"],"properties":"📏min 📏max","name":"format","icon":"📄","codeName":"FORMAT"},
   "📄page" : {"properties":"📄format 🔄orientation","name":"page","icon":"📄","codeName":"PAGE","tags":[]},
   "📏unit" : {"tags":["🖨️pao","💠property","💠abstract"],"name":"unit","icon":"📏","codeName":"UNIT"},
   "📏distance" : {"title":"distance unit","tags":["🖨️pao","📏unit","💠property","💠abstract"],"name":"distance","icon":"📏","codeName":"DISTANCE"},
   "🔄orientation" : {"description":"orientation of a 📄format","tags":["🖨️pao"],"name":"orientation","icon":"🔄","codeName":"ORIENTATION"},
   "🔄landscape" : {"description":"use .max size for the 📄format's width and .min size for 📄format's height","tags":["🔄orientation"],"name":"landscape","icon":"🔄","codeName":"LANDSCAPE"},
   "🔄portrait" : {"description":"use .min size for the 📄format's width and .max size for 📄format's height","tags":["🔄orientation"],"name":"portrait","icon":"🔄","codeName":"PORTRAIT"},
   "🖨️copies" : {"description":"quantity printed","tags":["🖨️pao"],"name":"copies","icon":"🖨️","codeName":"COPIES"},
   "📏mm" : {"alias":"millimeter","description":"📏distance in millimeter","tags":["🖨️pao","📏distance"],"name":"mm","icon":"📏","codeName":"MM"},
   "📏inch" : {"alias":"inches","description":"📏distance in inch","tags":["🖨️pao"],"name":"inch","icon":"📏","codeName":"INCH"},
   "📏dpi" : {"tags":["🖨️pao","💠property","📏unit"],"name":"dpi","icon":"📏","codeName":"DPI"},
   "📏width" : {"title":"⬜canvas' width","tags":["🖨️pao","📏distance","💠property"],"name":"width","icon":"📏","codeName":"WIDTH"},
   "📏height" : {"title":"⬜canvas' height","tags":["🖨️pao","📏distance","💠property"],"name":"height","icon":"📏","codeName":"HEIGHT"},
   "📏margins" : {"title":"⬜canvas' margin","description":"printing margin \nfor the consistance of definition it possible to set negative value :\n    * positive 📏margins: is inside the ⬜canvas\n    * negative 📏margins: is outside the ⬜canvas, in another words is the bleed.\n","tags":["🖨️pao","📏distance","💠property"],"name":"margins","icon":"📏","codeName":"MARGINS"},
   "📏bleed" : {"description":"is the printable part of 📏margins","name":"bleed","icon":"📏","codeName":"BLEED","tags":[]},
   "📏padding" : {"title":"⬜canvas' paddings","tags":["🖨️pao","📏distance","💠property"],"name":"padding","icon":"📏","codeName":"PADDING"},
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
   "📘document" : {"description":"export as printable document (PDF)\nattach 🖨️copies into the request 📑foreach\n","tags":["🖨️pao","📐output"],"properties":"📄format 🔄orientation 📏margins 📐template 📐parameters 📑foreach","name":"document","icon":"📘","codeName":"DOCUMENT"},
   "🖨️printing" : {"description":"print a collection of 📘document","properties":"📑foreach 🖨️mode","tags":["🖨️pao"],"name":"printing","icon":"🖨️","codeName":"PRINTING"},
   "🖨️assembly" : {"description":"print a collection of 📘document like  🖨️printing\nbut assemble the 📄pages of document into larger 📄pages as much as possible.\nsample of layout: `|📏margins|📄page|📏gunter|📄page|📏gunter|📄page|📏margins|`\n","tags":["🖨️pao"],"properties":"📄format 🔄orientation 📏margins 📏gunter 📑foreach 🖨️mode","name":"assembly","icon":"🖨️","codeName":"ASSEMBLY"},
   "🖨️mode" : {"description":"printing behavior","tags":["🖨️pao"],"name":"mode","icon":"🖨️","codeName":"MODE"},
   "🚀production" : {"tag":"🖨️pao 🖨️mode","name":"production","icon":"🚀","codeName":"PRODUCTION","tags":[]},
   "🛑review" : {"description":"ignore 🖨️copies statement","tag":"🖨️pao 🖨️mode","name":"review","icon":"🛑","codeName":"REVIEW","tags":[]},
   "💠abstract" : {"name":"abstract","codeName":"ABSTRACT","icon":"💠","description":"undefined entry!"},
   "💠property" : {"name":"property","codeName":"PROPERTY","icon":"💠","description":"undefined entry!"},
   "📐output" : {"name":"output","codeName":"OUTPUT","icon":"📐","description":"undefined entry!"},

  };
}

