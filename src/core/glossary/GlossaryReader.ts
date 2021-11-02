import {parse } from 'yaml'

const TAG = /^(\W+)(\w+)?$/

export function readDataFromYaml(block: string) {
    return parse(block);
}

export function readGlossaryFromYaml(block: string) {
    return fixTagsDeclaration(readDataFromYaml(block));
}

function fixTagsDeclaration(data: any) {

    for (let fullName in data) {
        const item = data[fullName];
        const tag = fullName.match(TAG);

        item.name = tag[2];
        item.icon = tag[1];
        item.codeName = item.name.toUpperCase();
        const tags = item.tags ? item.tags.split(/\s+/) : [];
        item.tags = tags;

        for (let t of tags) {
            if (!(t in data)) {
                //console.debug("unknown!", t);
                const tag = t.match(TAG)

                const unknown = {
                    name: tag[2],
                    codeName: tag[2].toUpperCase(),
                    icon: tag[1],
                    description: "undefined entry!"
                }
                data[t] = unknown;
            }
        }
    }

    return data;
}