
/** auto generated */
export class Library{

    public static TAG = "🏷️tag";
    public static GLOSSARY = "📜glossary";
    public static BOOK = "📗book";
    public static BIBLIOGRAPHY = "📚bibliography";
    public static LIBRARY = "🏫library";
  
  
    public static metadata = {
     "🏷️tag" : {"alias":"tags","description":"A 🏷️tag is a concept define by anothers 🏷️tags and  metadata.\nThe important point, a 🏷️tag have to be unique in the 📜glossary.\n\n## Syntax\n\n```yaml\n\n<emoji><name>:\n    title: <optionnal: friendly name (usefull if the name is written in camel case)>\n    alias: <optionnal: list of declinaison>\n    description: <optionnal: description>\n    tags: <optionnal: list of 🏷️tags (indexation)>\n    properties: <optionnal: list of 🏷️tags (define the 🏷️tag like a spinnet for the blueprint's editor)>\n```\n## Usages\n\n## basic 🏷️tag\n## spinnet 🏷️tag\n","name":"tag","icon":"🏷️","codeName":"TAG","tags":[]},
     "📜glossary" : {"alias":"glossaries","description":"📜glossary is set of 🏷️tags define in the 📗book and its the 📜glossary\n","name":"glossary","icon":"📜","codeName":"GLOSSARY","tags":[]},
     "📗book" : {"alias":"books","description":"a 📗book contains a glossary defined in several files on your disk.\n\n## How to define a book\n\n### mark your files\n\nAdd a the header in each file to assign it.\n\n### Add a 🏷️tag in the 🏫library\n\n```yml\n📗mybook:\ntag: 📗book\n📚bibliography: 📗firstbook 📗secondbook\n```\n\n```yml\n📗book: <the book's tag>\n```\n\n## extends your glossary\n\nAdd 📗books in the 📗book's 📚bibliography in order to use existing glossaries.\nBy design: you can't override an entry from the 📚bibliography : one concept have to define by a dedicated word.\n","properties":"📚bibliography","name":"book","icon":"📗","codeName":"BOOK","tags":[]},
     "📚bibliography" : {"alias":"bibliographies","description":"define the glossaries from others 📗books used by your 📗book\n","name":"bibliography","icon":"📚","codeName":"BIBLIOGRAPHY","tags":[]},
     "🏫library" : {"alias":"🏫libraries","tag":"📗book","description":"library is the magic 📗book that contains the definition of others 📗books\n","name":"library","icon":"🏫","codeName":"LIBRARY","tags":[]},
  
    };
  }