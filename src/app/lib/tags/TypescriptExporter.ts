export function exportAsTypescript(data: any) {

    let constants = "";
    let metadata = "";

    for (let fullName in data) {
        const item = data[fullName]
        
        // entries
        constants += `  public static ${item.codeName} = "${fullName}";\n`
        metadata += `   "${fullName}" : ${JSON.stringify(item)},\n`;
    }

    return `

/** auto generated */
export class Tags{

${constants}

  public static metadata = {
${metadata}
  };
}

`

}