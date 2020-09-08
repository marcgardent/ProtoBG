import { Injectable } from '@angular/core';
import { EventhubService } from './eventhub.service';
import { IWorkspace } from '../lib/editor/models';
import { fixTagsDeclaration } from '../lib/tags/TagParser';
import { readGlossaryFromYaml } from '../lib/tags/YamlTagLexer';
import { Glossary } from '../lib/tags/Glossary';
import { MetaTags } from '../lib/tags/meta.tags';
import { Templating } from '../lib/templating/templating.tag';
import { Pao } from '../lib/pao/pao.tags';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService {

  constructor(private readonly hub: EventhubService) {
    this.hub.workspace.subscribe((w) => {
      if (w) { this.updateGlossary(w); }
    });

    this.hub.glossary.next(new Glossary(MetaTags.metadata, Templating.metadata, Pao.metadata));
  }

  private updateGlossary(workspace: IWorkspace) {
    const content = '\n'.concat(...workspace.ressources.filter(x => x.type === 'glossary').map(x => x.content));

    try {
      debugger;
      const data = readGlossaryFromYaml(content);
      fixTagsDeclaration(data);
      const glossary = new Glossary(MetaTags.metadata, Templating.metadata, Pao.metadata, data);
      this.hub.glossary.next(glossary);

    } catch (exception) {
      this.hub.onError.next("fix the glossary");
      console.error(exception);
    } 
  }
}