

/** auto generated */
export class Pao{

  public static PAO = "🖨️pao";
  public static CANVAS = "⬜canvas";
  public static PAGE = "📄page";
  public static DOCUMENT = "📄document";
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
  public static PADDINGS = "📏paddings";
  public static CORNERS = "📏corners";
  public static MIN = "📏min";
  public static MAX = "📏max";
  public static A4 = "📄A4";
  public static ABSTRACT = "💠abstract";
  public static PROPERTY = "💠property";


  public static metadata = {
   "🖨️pao" : {"title":"PAO namespace","name":"pao","icon":"🖨️","codeName":"PAO","tags":[]},
   "⬜canvas" : {"description":"is an rectangle to display something","tag":"🖨️pao 💠abstract","name":"canvas","icon":"⬜","codeName":"CANVAS","tags":[]},
   "📄page" : {"alias":"pages","tags":["🖨️pao","⬜canvas","💠abstract"],"properties":"📏min 📏max","name":"page","icon":"📄","codeName":"PAGE"},
   "📄document" : {"description":"is collection of 📄pages","tags":["🖨️pao"],"name":"document","icon":"📄","codeName":"DOCUMENT"},
   "📏unit" : {"tags":["🖨️pao","💠property","💠abstract"],"name":"unit","icon":"📏","codeName":"UNIT"},
   "📏distance" : {"title":"distance unit","tags":["🖨️pao","📏unit","💠property","💠abstract"],"name":"distance","icon":"📏","codeName":"DISTANCE"},
   "🔄orientation" : {"description":"orientation of a 📄page","tags":["🖨️pao"],"name":"orientation","icon":"🔄","codeName":"ORIENTATION"},
   "🔄landscape" : {"description":"use .max size for the 📄page's width and .min size for 📄page's height","tags":["🔄orientation"],"name":"landscape","icon":"🔄","codeName":"LANDSCAPE"},
   "🔄portrait" : {"description":"use .min size for the 📄page's width and .max size for 📄page's height","tags":["🔄orientation"],"name":"portrait","icon":"🔄","codeName":"PORTRAIT"},
   "🖨️copies" : {"description":"quantity printed","tags":["🖨️pao"],"name":"copies","icon":"🖨️","codeName":"COPIES"},
   "📏mm" : {"alias":"millimeter","description":"📏distance in millimeter","tags":["🖨️pao","📏distance"],"name":"mm","icon":"📏","codeName":"MM"},
   "📏inch" : {"alias":"inches","description":"📏distance in inch","tags":["🖨️pao"],"name":"inch","icon":"📏","codeName":"INCH"},
   "📏dpi" : {"tags":["🖨️pao","💠property","📏unit"],"name":"dpi","icon":"📏","codeName":"DPI"},
   "📏width" : {"title":"⬜canvas' width","tags":["🖨️pao","📏distance","💠property"],"name":"width","icon":"📏","codeName":"WIDTH"},
   "📏height" : {"title":"⬜canvas' height","tags":["🖨️pao","📏distance","💠property"],"name":"height","icon":"📏","codeName":"HEIGHT"},
   "📏margins" : {"title":"⬜canvas' margin","tags":["🖨️pao","📏distance","💠property"],"name":"margins","icon":"📏","codeName":"MARGINS"},
   "📏bleed" : {"description":"is printable 📏margins","name":"bleed","icon":"📏","codeName":"BLEED","tags":[]},
   "📏paddings" : {"title":"⬜canvas' paddings","tags":["🖨️pao","📏distance","💠property"],"name":"paddings","icon":"📏","codeName":"PADDINGS"},
   "📏corners" : {"title":"radius corner of ⬜canvas","tags":["🖨️pao","📏distance","💠property"],"name":"corners","icon":"📏","codeName":"CORNERS"},
   "📏min" : {"title":"is min side of ⬜canvas","tags":["🖨️pao","📏distance","💠property"],"name":"min","icon":"📏","codeName":"MIN"},
   "📏max" : {"title":"is max side of ⬜canvas","tags":["🖨️pao","📏distance","💠property"],"name":"max","icon":"📏","codeName":"MAX"},
   "📄A4" : {"description":"it is a 📄page in A4 Format.","tags":["🖨️pao","📄page"],"📏min":"210📏mm","📏max":"297📏mm","name":"A4","icon":"📄","codeName":"A4"},
   "💠abstract" : {"name":"abstract","codeName":"ABSTRACT","icon":"💠","description":"undefined entry!"},
   "💠property" : {"name":"property","codeName":"PROPERTY","icon":"💠","description":"undefined entry!"},

  };
}

