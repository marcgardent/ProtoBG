import { IBook, IResource, IWorkspace } from "src/core/editor/models";
import { LibraryTags } from "src/core/library/library.tags";

export class Library {

    METADATA_REGEX = /^#>\s*(\S+)\s*:\s*(\S+)\s*$/gm
    public readonly books: Map<string, IBook> = new Map;

    constructor(private readonly workspace: IWorkspace) {
        this.load();
    }

    private load() {
        for (let resource of this.workspace.resources) {
            const metadata = this.loadMetaData(resource);
            if (metadata.has(LibraryTags.BOOK)) {
                const theBook = this.register(resource, LibraryTags.DEFAULT);
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

    loadMetaData(resource: IResource): Map<string, string> {
        const matches = resource.content.matchAll(this.METADATA_REGEX);
        const metadata = new Map;
        for (let match of matches) {
            const key = match[1];
            const value = match[2];
            if (metadata.has(key)) {
                //TODO Error!?
            }
            else {
                metadata.set(key, value);
            }
        }
        return metadata;
    }
}