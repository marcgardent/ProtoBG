

/** auto generated */
export class MetaTags {

    public static REQUEST = "📑request";
    public static FOREACH = "📑foreach";
    public static IS = "📑is";
    public static AMONG = "📑among";
    public static WITH = "📑with";


    public static metadata = {
        "💠glossary": { "description": "is collection of 💠entry", "name": "glossary", "icon": "💠", "codeName": "GLOSSARY", "tags": [] },
        "💠entry": { "description": "is a concept identified by <emoji><name> and described with some metadata.\nentries are linked with tag system.\n\nusage:\n\n```yaml\n\n💠name:\n    title: entry's title\n    description: |\n        this is an description of entry.\n    tags: 💠tag1 💠tag2 \n\n```\n", "name": "entry", "icon": "💠", "codeName": "ENTRY", "tags": [] },
        "💠abstract": { "description": "do not use directly", "name": "abstract", "icon": "💠", "codeName": "ABSTRACT", "tags": [] },
        "💠property": { "description": "do not use directly", "name": "property", "icon": "💠", "codeName": "PROPERTY", "tags": [] },
        "📑request": { "description": "is request", "name": "request", "icon": "📑", "codeName": "REQUEST", "tags": [] },
        "📑foreach": { "description": "to do something for each entry of the 📑request\nsample in order to:\n* select one 💠entry : `{ 📑is : 👨johnDoe }`\n* select a population without constraints  : `{ 📑among : 👨human 🦁animals }`\n* select a population  with constraints : `{ 📑among : 👨human 🦁animals, 📑with: 👓glasses 🧦socks}`\n  * in another word: all `👨human OR 🦁animals with 👓glasses AND 🧦socks`\n", "tags": ["📑request"], "name": "foreach", "icon": "📑", "codeName": "FOREACH" },
        "📑is": { "description": "📑request clause\n", "name": "is", "icon": "📑", "codeName": "IS", "tags": [] },
        "📑among": { "description": "📑request clause\n", "name": "among", "icon": "📑", "codeName": "AMONG", "tags": [] },
        "📑with": { "description": "📑request clause\n", "name": "with", "icon": "📑", "codeName": "WITH", "tags": [] },

    };
}

