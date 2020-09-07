

function register(){
    
    let todo: any;

    todo.loaded.subscribe(res => {
        this.monaco = res.monaco;
        const self = this;
  
        // this.monaco.languages.register({'id': this.codeModel.language})
  
        this.monaco.languages.registerRenameProvider(this.codeModel.language, {
          provideRenameEdits: (model, position, newName) => {
  
            //custom range
            const theWord = model.getWordAtPosition(position);
            if (theWord) {
              const parsed = theWord.word.match(/([0-9]*)(.+)/);
  
              const match = new RegExp(parsed[2], "g");
              let lineNumber = 1;
  
              const edits = new Array();
  
              for (let line of model.getLinesContent()) {
                for (let matched of [...line.matchAll(match)]) {
  
                  edits.push({
                    resource: model.uri,
                    edit: {
                      range: {
                        endColumn: matched.index + 1 + matched[0].length,
                        endLineNumber: lineNumber,
                        startColumn: matched.index + 1,
                        startLineNumber: lineNumber,
                      },
                      text: newName
                    }
                  });
  
                }
  
                lineNumber++;
              }
  
              const ret = {
                edits: edits
              }
              console.debug(ret);
              return ret;
            }
            else {
              return { rejectReason: "not possible to rename here!" }
            }
          }
        });
  
        this.monaco.languages.registerCompletionItemProvider(this.codeModel.language, {
          //triggerCharacters: [' '],
          provideCompletionItems: (model, position, context) => {
  
            if (position.column === 1) {
              return { suggestions: this.snippetSuggestions };
            } else {
  
              //Default range
              let range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column,
              };
  
              //custom range
              const theWord = model.getWordAtPosition(position);
              if (theWord) {
                const parsed = theWord.word.match(/([0-9]*)([^:]*)/);
                if (parsed[1].length == 0) {
                  range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: theWord.startColumn,
                    endColumn: theWord.endColumn,
  
                  };
                }
              }
  
              // sort suggestions
              const tagContext = (<string>model.getLineContent(position.lineNumber)).match(/^\s+((\W+)(\w+)):/);
              if (tagContext) {
                console.debug("context", tagContext[1]);
  
                this.tagSuggestions.forEach(suggestion => {
                  suggestion.range = range;
                  if (suggestion._entry.tags.indexOf(tagContext[1]) >= 0) {
  
                    suggestion.sortText = "__" + suggestion.insertText;
                    suggestion.label = suggestion.insertText + " 💖";
                  }
                  else if (tagContext[1].startsWith(suggestion._entry.icon)) {
                    suggestion.sortText = "_" + suggestion.insertText;
                    suggestion.label = suggestion.insertText + " 🤍";
                  }
                  else {
                    suggestion.label = suggestion.sortText = suggestion.insertText;
                  }
                });
              }
              else {
                this.tagSuggestions.forEach(x => { x.range = range; x.sortText = x.insertText });
              }
              return { suggestions: this.tagSuggestions };
            }
  
          }
        });
  
        this.monaco.languages.registerHoverProvider(this.codeModel.language, {
          provideHover: function (model, position) {
  
            const { column, lineNumber } = position;
            const theWord = model.getWordAtPosition(position);
            if (theWord) {
              const parsed = theWord.word.match(/([0-9]*)([^:]*)/);
              const entry = self.glossary.getAsEntry(parsed[2]);
              console.debug("theWord!", parsed[2]);
              if (entry.isValid) {
                return {
                  range: new self.monaco.Range(lineNumber, theWord.startColumn, lineNumber, theWord.endColumn),
                  contents: [
                    { value: `## ${entry.displayName}` },
                    { value: `**tags:** ${entry.tagAsEntries.map(x => x.displayName).join(", ")}` },
                    { value: `**description:** ${entry.description}` },
                    { value: `**implements:** ${entry.properties.join(", ")}` }
                  ]
                }
              }
              else {
                return undefined;
              }
            } else {
              return undefined;
            }
          }
        });
    });
}