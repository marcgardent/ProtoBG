

/** auto generated */
export class SearchTags {

    public static REQUEST = "📑request";
    public static FOREACH = "📑foreach";
    public static IS = "📑is";
    public static AMONG = "📑among";
    public static WITH = "📑with";

    public static metadata = {
        "📑request": { "description": "is request", "name": "request", "icon": "📑", "codeName": "REQUEST", "tags": [] },
        "📑foreach": { "description": "to do something for each entry of the 📑request\nsample in order to:\n* select one 💠entry : `{ 📑is : 👨johnDoe }`\n* select a population without constraints  : `{ 📑among : 👨human 🦁animals }`\n* select a population  with constraints : `{ 📑among : 👨human 🦁animals, 📑with: 👓glasses 🧦socks}`\n  * in another word: all `👨human OR 🦁animals with 👓glasses AND 🧦socks`\n", "tags": ["📑request"], "name": "foreach", "icon": "📑", "codeName": "FOREACH" },
        "📑is": { "description": "📑request clause\n", "name": "is", "icon": "📑", "codeName": "IS", "tags": [] },
        "📑among": { "description": "📑request clause\n", "name": "among", "icon": "📑", "codeName": "AMONG", "tags": [] },
        "📑with": { "description": "📑request clause\n", "name": "with", "icon": "📑", "codeName": "WITH", "tags": [] },

    };
}

