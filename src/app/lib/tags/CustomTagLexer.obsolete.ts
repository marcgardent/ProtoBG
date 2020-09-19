const OPEN_TAG = /^([^A-Za-z\+\-\*\:]+)(\w+):(.*)?$/
const TAG = /^([^A-Za-z\+\-\*\:]+)(\w+)(([\+\-\*\:])(\d+))?$/

function isTags(line: string) {
    const words = line.split(/\s+/).filter(x => x != "");
    const ret = words.length > 0 && words.findIndex((v) => v != "" && !v.match(TAG)) == -1;
    return ret;
}

function readTag(text: string) {
    if (text) {
        const reg = text.match(TAG);
        if (reg) {
            return {
                icon: reg[1],
                name: reg[2],
                operator: reg[4],
                value: reg[5]
            }
        }
    }
    return { icon: "#", name: "undefined", operator: undefined, value: undefined }
    
}

function readSubLine(indent: string, line: string) {
    if (line.startsWith(indent)) {
        return line.substring(indent.length, line.length);
    }
    else {
        return undefined;
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
                        item.tags.push(subLine.split(/\s+/).map(x => readTag(x)));
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
                data: line
            });
        }
        console.groupEnd();
    }
    console.groupEnd();
    return ret;
}