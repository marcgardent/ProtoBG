const TOKEN_BLOCK = /\`\`\`tokens [^\`]*\`\`\`/gs

function getTokenBlock(md: string) {
    return [...md.matchAll(TOKEN_BLOCK)].map(x => x[1]);
}
