const OPEN_TAG = /^([^A-Za-z\+\-\*\:]+)(\w+):(.*)?$/
const TAG = /^[^A-Za-z\+\-\*\:]+\w+([\+\-\*\:]\d+)?$/

const TOKEN_BLOCK = /\`\`\`tokens [^\`]*\`\`\`/gs

function isTags(line: string) {
    const words = line.split(/\s+/).filter(x => x != "");
    const ret = words.length > 0 && words.findIndex((v) => v != "" && !v.match(TAG)) == -1;
    return ret;
}

function readSubLine(indent: string, line: string) {
    if (line.startsWith(indent)) {
        return line.substring(indent.length, line.length);
    }
    else {
        return undefined;
    }
}

export class Token {
    constructor(
        public readonly icon: string,
        public readonly name: string,
        public readonly description: string,
        public readonly tags: Array<Token> = []
    ) { }
}

// export function tokensFromMarkdown(md:string) {
//     const allInOne = getTokenBlock(md).join("\n");
//     return readTokens(allInOne);
//     return buildTags(readTokens(allInOne));
// }

function getTokenBlock(md: string) {
    return [...md.matchAll(TOKEN_BLOCK)].map(x => x[1]);
}

function buildTags(entries: Map<string, any>) {
    const ret = new Map<string, Token>();

    for (let [k, v] of entries.entries()) {
        ret.set(k, new Token(v.icon, v.name, v.description, []));
    }

    for (let [k, v] of ret.entries()) {
        for (let tagKey of entries[k].tags) {
            if (ret.has(tagKey)) {
                v.tags.push(ret[tagKey]);
            }
            else {
                console.warn("tag unknown", tagKey);
            }
        }
    }
}

export function readGlossaryFromMarkdown(block: string) {

    const lines = block.split("\n");
    console.group("read token block...");
    const ret = new Array<any>();
    console.debug("lines", block, lines);
    for (let i = 0; i < lines.length; i++) {

        console.group("read entry...");
        const line = lines[i];
        const openToken = line.match(OPEN_TAG);
        if (openToken) {
            const item = {
                type: 'entry',
                lineBegin: i,
                lineEnd: i,
                icon: openToken[1],
                name: openToken[2],
                title: openToken[3] ? openToken[3] : "",
                description: "",
                tags: []
            }
            console.debug("line.entry", line);

            //read indent block
            let indentation = undefined;
            if (i + 1 < lines.length) {
                const subLine = lines[i + 1];
                const matchIndent = subLine.match(/^(\s+).*$/);
                if (matchIndent) {
                    indentation = matchIndent[1];
                }
                console.debug("line.indentation.read", subLine, indentation);
            }

            if (indentation) {
                i++;

                //read description
                for (; i < lines.length; i++) {
                    const subLine = readSubLine(indentation, lines[i]);
                    if (subLine && !isTags(subLine)) {
                        item.description += subLine + "\n";
                        console.debug("line.description", subLine);
                    }
                    else {
                        //i--;
                        console.debug("line.break.desc", lines[i]);
                        break;
                    }
                }

                //read tags
                for (; i < lines.length; i++) {
                    const subLine = readSubLine(indentation, lines[i]);
                    if (subLine && isTags(subLine)) {
                        item.tags.push(subLine.split(/\s+/));
                        console.debug("line.tags", subLine);
                    }
                    else {
                        i--;
                        console.debug("line.break.tag", lines[i]);
                        break;
                    }
                }
            }
            
            item.lineEnd = i;
            ret.push(item);
        }
        else {
            console.debug("line.ignored", line);
            ret.push({
                type: 'markdown',
                lineBegin: i,
                lineEnd: i,
                data:line
            });
        }
        console.groupEnd();
    }
    console.groupEnd();
    return ret;
}