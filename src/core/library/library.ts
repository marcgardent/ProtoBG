import { IBook, IResource, IWorkspace } from "src/core/models";
import { LibraryTags } from "src/core/library/library.tags";
import { IConsole, SilentConsole } from "src/core/report";
export const DefaultBook: IBook = { name: LibraryTags.DEFAULT, resources: [], dependencies: new Set<string>() };

export class Library {

    METADATA_REGEX = /^#>\s*(\S+)\s*:\s*(\S+)\s*$/gm
    public readonly books: Map<string, IBook> = new Map;
    
    constructor(private readonly trace: IConsole, private readonly workspace: IWorkspace) {    
        this.books.set(DefaultBook.name, DefaultBook);
        this.load();
        trace.debug("Core.Library", "the books have been loaded: " +  [...this.books.keys()].join(','));
    }

    private load() {
        for (let resource of this.workspace.resources) {
            const metadata = this.loadMetaData(resource);
            if (metadata.has(LibraryTags.BOOK)) {
                const theBook = this.register(resource, metadata.get(LibraryTags.BOOK));
                if (metadata.has(LibraryTags.BIBLIOGRAPHY)) {
                    for (const dependency of metadata.get(LibraryTags.BIBLIOGRAPHY).split(/\s+/)) {
                        theBook.dependencies.add(dependency);
                    }
                }
            }
            else {
                this.register(resource, LibraryTags.DEFAULT);
            }
        }
    }

    private register(resource: IResource, bookName: string): IBook {
        let ret: IBook;
        if (this.books.has(bookName)) {
            ret = this.books.get(bookName);
            ret.resources.push(resource)
        }
        else {
            ret = { name: bookName, resources: [resource], dependencies: new Set<string>() };
            this.books.set(bookName, ret);
        }
        return ret;
    }

    private loadMetaData(resource: IResource): Map<string, string> {
        const matches = resource.content.matchAll(this.METADATA_REGEX);
        const metadata = new Map;
        this.trace.verbose("Core.Library.loadMetaData", `the metadata in '${resource.name}' are being loaded`);
        for (let match of matches) {
            const key = match[1];
            const value = match[2];
            if (metadata.has(key)) {
                this.trace.error("Core.Library.loadMetaData", `a duplicate metadata have been found: declare '${key}' once`);
            }
            else {
                this.trace.verbose("Core.Library.loadMetaData", `the metadata '${key}=${value}' have been loaded`);
                metadata.set(key, value);
            }
        }
        return metadata;
    }
}

export const DefaultLibrary: Library = new Library(new SilentConsole(), { saved: "", currentResource: "", resources: [] });
