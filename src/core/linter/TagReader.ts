import { Glossary } from "src/core/glossary/Glossary";
import { IResource } from "src/core/models";
import { IBlock } from "./models";



export class TagReader {

    private readonly TAG_REGEX = /([^0-9a-zA-Z\s!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]+)([a-zA-Z]+\w*)/g;
    public readonly undefinedCases = new Array<IBlock>();
    constructor(private readonly resource: IResource, private readonly glossary: Glossary) {

        let lineNumber = 1;
        for (let line of this.resource.content.split("\n")) {

            const matches = line.matchAll(this.TAG_REGEX);
            for (let match of matches) {
                const tag = match[1] + match[2];
                if (!this.glossary.get(tag)) {

                    const msg: IBlock = {
                        startLineNumber: lineNumber,
                        startColumn: match.index + 1,
                        endLineNumber: lineNumber,
                        endColumn: match.index + 1 + tag.length,
                        lines: [line],
                        name: tag,
                        message: `tag '${tag}' is undefined`
                    };
                    this.undefinedCases.push(msg);
                }
            }
            lineNumber++;
        }
    }
}
