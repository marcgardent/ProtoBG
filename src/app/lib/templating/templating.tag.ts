

/** auto generated */
export class Templating {

  public static TEMPLATE = "📐template";
  public static DEFINITION = "📐definition";
  public static PARAMETERS = "📐parameters";
  public static NUNJUCKS = "📐nunjucks";
  public static DOCUMENT = "📐document";
  
  public static metadata = {
    "📐template": { "description": "is reusable template", "name": "template", "icon": "📐", "codeName": "TEMPLATE", "tags": [] },
    "📐definition": { "description": "is definition of a template", "name": "definition", "icon": "📐", "codeName": "DEFINITION", "tags": [] },
    "📐parameters": { "title": "custom parameters for 📐template", "description": "it is custom map to define parameters for a 📐template", "name": "parameters", "icon": "📐", "codeName": "PARAMETERS", "tags": [] },
    "📐nunjucks": { "description": "it's nunjucks template, see https://mozilla.github.io/nunjucks/", "tags": ["📐template"], "properties": "📐definition", "name": "nunjucks", "icon": "📐", "codeName": "NUNJUCKS" },
    "📐document": { "description": "publish the output of the template", "properties": "📐template 📐parameters 📑foreach", "name": "outputs", "icon": "📐", "codeName": "OUTPUTS", "tags": [] },

  };
}

