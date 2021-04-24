/** auto generated */
export class LibraryTags{

  public static TAG = "🏷️tag";
  public static GLOSSARY = "📜glossary";
  public static BOOK = "📗book";
  public static DEFAULT = "📗default";
  public static BIBLIOGRAPHY = "📚bibliography";
  public static REGISTRY = "📙registry";
  


  public static metadata = {
   "🏷️tag" : {"alias":"tags","description":"A 🏷️tag is a concept define by anothers 🏷️tags and a description and custom metadata.\nA 🏷️tag have to be unique in a 📜glossary.\n","name":"tag","icon":"🏷️","codeName":"TAG","tags":[]},
   "📜glossary" : {"alias":"glossaries","description":"📜glossary is set of 🏷️tags\n","name":"glossary","icon":"📜","codeName":"GLOSSARY","tags":[]},
   "📗book" : {"alias":"books","description":"a 📗book contains a glossary defined in several files on your disk.\n\n## How to define a book\n\nAdd a the header in each file to assign it.\n\n```yml\n📗book:📗mybook\n```\n\n## extends your glossary\n\nAdd 📗books in the 📗book's 📚bibliography in order to use existing glossaries.\nBy design: you can't override an entry from the 📚bibliography : one concept have to define by a dedicated word.\n","properties":"📚bibliography","name":"book","icon":"📗","codeName":"BOOK","tags":[]},
   "📚bibliography" : {"description":"define the glossaries from others 📗books used by your 📗book\n","name":"bibliography","icon":"📚","codeName":"BIBLIOGRAPHY","tags":[]},
   "📙registry" : {"tag":"📗book","description":"registry is the magic 📗book to define the 📜glossary that contains the 📗books' definitions.\n\nBy convention add a file registry.yml in your project, for instance:\n```yml\n\n📗book: 📙registry\n\n📗mybook:\n  tags: 📗book\n  📚bibliography: 📗otherbook\n\n📗otherbook:\n  tags: 📗book\n```\n","name":"registry","icon":"📙","codeName":"REGISTRY","tags":[]},

  };
}