import { Glossary } from "src/core/glossary/Glossary";
import { readDataFromYaml } from "src/core/glossary/GlossaryReader";
import { BlockReader } from "src/core/linter/BlockReader";
import { IBlock, IReport } from "src/core/linter/models";
import { TagReader } from "src/core/linter/TagReader";
import { IWorkspace } from "src/core/models";
import { IConsole } from "src/core/report";

export class Linter {
    public constructor(private readonly trace: IConsole){

    }

    public lintTags(glossary : Glossary, workspace: IWorkspace) : Array<IReport>  {
        const ret: IReport[] = [];
        for (let resource of workspace.resources) {
            const tags = new TagReader(resource, glossary);
            if (tags.undefinedCases.length > 0) {
                ret.push({
                    resource: resource,
                    errors: tags.undefinedCases
                });
            }
        }

        return ret;
    }

    public lintYaml(workspace: IWorkspace) : Array<IReport> {
        const ret = [];
        const dict = new Map<string, IBlock>();
        for (let resource of workspace.resources) {

            const report = {
                resource: resource,
                errors: new Array<IBlock>()
            }

            const reader = new BlockReader(resource);

            for (let block of reader.blocks) {

                if (block.name) {
                    if (dict[block.name]) {
                        const def = dict[block.name];
                        const clone = JSON.parse(JSON.stringify(block));
                        clone.message = `'${block.name}' has already been defined at lines [${def.startLineNumber} - ${def.endLineNumber}], file '${def.resource.name}'.`;
                        report.errors.push(clone);
                    }
                    else {
                        dict[block.name] = block;
                    }
                }
                try {
                    readDataFromYaml(block.lines.join("\n"));
                }
                catch (error) {
                    block.message = `${error.name}: ${error.message}`;
                    report.errors.push(block);
                }
            }
            if (report.errors.length > 0) {
                ret.push(report);
            }
        }
        return ret;
    }
}
