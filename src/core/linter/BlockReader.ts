import { IResource } from "src/core/models";
import { IBlock } from "./models";


export class BlockReader {
    private readonly lines: string[];
    private currentLine = 0;
    private buffer = [];
    public readonly blocks: Array<IBlock>;

    constructor(public readonly resource: IResource) {
        this.lines = this.resource.content.split("\n");
        this.blocks = this.toBlock();
    }

    private toBlock() {
        const blocks = new Array<IBlock>();
        do {
            const entry = this.whileEntry();
            let block;
            if (entry) {
                block = {
                    resource: this.resource,
                    name: entry,
                    startLineNumber: blocks.length == 0 ? 1 : this.currentLine + 1,
                    endLineNumber: this.currentLine + 1,
                    startColumn: 0,
                    endColumn: 1000,
                    lines: [],
                    message: ""
                };
            }
            else {
                block = {
                    resource: this.resource,
                    name: undefined,
                    startLineNumber: blocks.length == 0 ? 1 : this.currentLine + 1,
                    endLineNumber: this.currentLine + 1,
                    lines: [],
                    startColumn: 0,
                    endColumn: 1000,
                    message: ""
                };
            }

            block.endLineNumber += this.readBlock();
            block.lines = this.buffer; this.buffer = [];
            blocks.push(block);

        } while (this.continue());
        return blocks;
    }

    private readBlock() {
        let ret = 0;
        this.next();
        do {
            const line = this.peak();
            const parsed = line.match(/^([^#:\s][^:]*(\s*)):/);
            if (!parsed) {
                ret += 1;
            }
            else {
                return ret;
            }
        } while (this.next());

        return ret;
    }

    private whileEntry() {
        do {
            const line = this.peak();
            const parsed = line.match(/^([^#:\s][^:]*(\s*)):/);
            if (parsed) {
                return parsed[1];
            }
        } while (this.next());

        return undefined;
    }

    private peak() {
        return this.lines[this.currentLine];
    }

    private continue() {
        return this.currentLine < this.lines.length;
    }

    private next() {
        this.buffer.push(this.peak());
        this.currentLine++;
        return this.currentLine < this.lines.length;
    }
}
