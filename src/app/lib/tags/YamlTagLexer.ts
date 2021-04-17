import {parse } from 'yaml'


export function readGlossaryFromYaml(block: string) {
    return parse(block);
}

