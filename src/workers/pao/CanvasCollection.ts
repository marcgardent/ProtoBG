import { IDocument } from "src/workers/bundle/IDocument";
import { IMessenger } from "src/core/report";
import { ILayout } from "src/workers/pao/PaoContext";
import { SvgCollection } from "src/workers/pao/SvgCollection";


export class CanvasCollection implements IDocument {

    constructor(private readonly messenger: IMessenger, private readonly entry: any, private readonly svg: SvgCollection, private readonly dpi) {

    }

    /**
     * export png Base64
     */

    public toRaw() {

        const ret = new Array();
        for (let source of this.toHTMLCanvasElement()) {
            ret.push({
                content: source.content.then(c => c.toDataURL("image/png"))
                    .then(x => x.replace(/^data:image\/png;base64,/, "")),
                context: source.context,
                model: source.model,
                type: "png",
                base64: true
            });
        }

        return ret;
    }


    public toHTMLCanvasElement(): { content: Promise<HTMLCanvasElement>; context: any; model: any; layout: ILayout }[] {

        const ret = new Array();
        for (let source of this.svg.toRaw()) {
            ret.push({
                content: source.content
                    .then(c => { return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(c))); })
                    .then(dataUri => this.loadImage(dataUri))
                    .then(img => this.loadCanvas(img)),
                context: source.context,
                model: source.model,
                layout: this.svg.layout
            });
        }

        return ret;
    }

    private loadImage(url) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            let img = new Image();
            img.addEventListener('load', e => resolve(img));
            img.addEventListener('error', (e) => {
                this.messenger.error({ entry: this.entry, raw: e, message: `can't load the image '${url.substring(0, 30)}...'`, url: url });
                reject(new Error(`Failed to load image's URL: ${url.substring(0, 30)}...`));
            });
            img.src = url;
        });
    }


    private loadCanvas(x: HTMLImageElement): HTMLCanvasElement {

        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        canvas.height = this.svg.layout.height / 25.4 * this.dpi;
        canvas.width = this.svg.layout.width / 25.4 * this.dpi;
        const context = canvas.getContext("2d");
        context.drawImage(x, 0, 0, canvas.width, canvas.height);
        return canvas;
    }
}
