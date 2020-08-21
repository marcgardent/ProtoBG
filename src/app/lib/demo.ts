export class Tags {

    public static PAO = {"description":"test\ntest\n","title":"PAO namespace","name":"pao","icon":"📐"};
    public static CANVAS = {"title":"area","tags":"📐pao 💠abstract","properties":"📏width 📏height 📏margins 📏corners","name":"canvas","icon":"⬜"};
    public static WIDTH = {"title":"canvas' width","tags":"📐pao 📏measure 💠property","name":"width","icon":"📏"};
    public static HEIGHT = {"title":"canvas' height","tags":"📐pao 📏measure 💠property","name":"height","icon":"📏"};
    public static MARGINS = {"title":"canvas' margin","tags":"📐pao 📏measure 💠property","name":"margins","icon":"📏"};
    public static CORNERS = {"title":"radius corner of canvas","tags":"📐pao 📏measure 💠property","name":"corners","icon":"📏"};
    public static MEASURE = {"title":"distance unit","tags":"📐pao 📐unit 💠property 💠abstract","name":"measure","icon":"📏"};
    public static MIN = {"title":"is min size of ⬜canvas","tags":"📐pao 📏measure 💠property","name":"min","icon":"📏"};
    public static MAX = {"title":"is max size of ⬜canvas","tags":"📐pao 📏measure 💠property","name":"max","icon":"📏"};
    public static DOCUMENT = {"title":"filled by canvas","tags":"📐pao","name":"document","icon":"."};
    public static ORIENTATION = {"description":"orientation of pages composed by an .document","tags":"📐pao","name":"orientation","icon":"."};
    public static LANDSCAPE = {"description":"use .max size for the .page's width and .min size for .page's height","tags":"🔄orientation","name":"landscape","icon":"🔄"};
    public static PORTRAIT = {"description":"use .min size for the .page's width and .max size for .page's height","tags":"🔄orientation","name":"portrait","icon":"🔄"};
    public static PAGE = {"tags":"📐pao","properties":"📏min 📏max","name":"page","icon":"📄"};
    public static A4 = {"description":"it is a 📄page in A4 Format.","tags":"📐pao 📄page","📏min":"210📏mm","📏max":"297📏mm","name":"A4","icon":"📄"};
    public static MM = {"alias":"millimeter","description":"📏measure in millimeter","tags":"📐pao 📏measure","name":"mm","icon":"📏"};
    public static INCH = {"alias":"inches","description":"📏measure in inch","tags":"📐pao","name":"inch","icon":"📏"};
    public static MAGICS = {"title":"Magic card format","tags":"⬜canvas","📏width":"68📏mm","📏height":"84📏mm","📏margins":"2📏mm","📏corners":"5📏mm","name":"magics","icon":"🃏"};
    public static DEFAULTCARDLAYOUT = {"title":"card layout","description":"is generic card template","tags":"📐pao 💠abstract","properties":"⬛left ⬛right ⬛bottom 📑for ⬜format","name":"defaultCardLayout","icon":"⬛"};
    public static FOR = {"tags":"📑request","name":"for","icon":"📑"};
    public static SLOT = {"tags":"💠abstract","name":"slot","icon":"⬛"};
    public static LEFT = {"tags":"⬛slot 💠property","name":"left","icon":"⬛"};
    public static RIGHT = {"tags":"⬛slot 💠property","name":"right","icon":"⬛"};
    public static BOTTOM = {"tags":"⬛slot 💠property","name":"bottom","icon":"⬛"};
    public static FORMAT = {"tags":"⬜canvas 💠property","name":"format","icon":"⬜"};
    public static FACTORY = {"title":"the factory","description":"amazing factory's description","tags":"🏢building","📈produce":"1🧰goods","📉consume":"10🧱raw","⚒️build":"10🧱raw","📐instances":10,"name":"factory","icon":"🏭"};
    public static MYCARDLAYOUT = {"tags":"⬛defaultCardLayout","⬛left":"📉consume","⬛right":"📈produce","⬛bottom":"⚒️build","📑from":[{"📑is":"🏭factory","📐instances":10}],"name":"myCardLayout","icon":"⬛"};

    public static  buildIndex(indexer){
        indexer.add(Tags.PAO, []);
        indexer.add(Tags.CANVAS, [Tags.PAO, Tags.ABSTRACT]);
        indexer.add(Tags.WIDTH, [Tags.PAO, Tags.MEASURE, Tags.PROPERTY]);
        indexer.add(Tags.HEIGHT, [Tags.PAO, Tags.MEASURE, Tags.PROPERTY]);
        indexer.add(Tags.MARGINS, [Tags.PAO, Tags.MEASURE, Tags.PROPERTY]);
        indexer.add(Tags.CORNERS, [Tags.PAO, Tags.MEASURE, Tags.PROPERTY]);
        indexer.add(Tags.MEASURE, [Tags.PAO, Tags.UNIT, Tags.PROPERTY, Tags.ABSTRACT]);
        indexer.add(Tags.MIN, [Tags.PAO, Tags.MEASURE, Tags.PROPERTY]);
        indexer.add(Tags.MAX, [Tags.PAO, Tags.MEASURE, Tags.PROPERTY]);
        indexer.add(Tags.DOCUMENT, [Tags.PAO]);
        indexer.add(Tags.ORIENTATION, [Tags.PAO]);
        indexer.add(Tags.LANDSCAPE, [Tags.ORIENTATION]);
        indexer.add(Tags.PORTRAIT, [Tags.ORIENTATION]);
        indexer.add(Tags.PAGE, [Tags.PAO]);
        indexer.add(Tags.A4, [Tags.PAO, Tags.PAGE]);
        indexer.add(Tags.MM, [Tags.PAO, Tags.MEASURE]);
        indexer.add(Tags.INCH, [Tags.PAO]);
        indexer.add(Tags.MAGICS, [Tags.CANVAS]);
        indexer.add(Tags.DEFAULTCARDLAYOUT, [Tags.PAO, Tags.ABSTRACT]);
        indexer.add(Tags.FOR, [Tags.REQUEST]);
        indexer.add(Tags.SLOT, [Tags.ABSTRACT]);
        indexer.add(Tags.LEFT, [Tags.SLOT, Tags.PROPERTY]);
        indexer.add(Tags.RIGHT, [Tags.SLOT, Tags.PROPERTY]);
        indexer.add(Tags.BOTTOM, [Tags.SLOT, Tags.PROPERTY]);
        indexer.add(Tags.FORMAT, [Tags.CANVAS, Tags.PROPERTY]);
        indexer.add(Tags.FACTORY, [Tags.BUILDING]);
        indexer.add(Tags.MYCARDLAYOUT, [Tags.DEFAULTCARDLAYOUT]);
    }
}