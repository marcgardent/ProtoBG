import { Injectable } from '@angular/core';
import { EventHubService } from './eventhub.service';
import { IWorkspace } from '../lib/editor/models';
import { fixTagsDeclaration } from '../lib/tags/TagParser';
import { readGlossaryFromYaml } from '../lib/tags/YamlTagLexer';
import { Glossary } from '../lib/tags/Glossary';
import { MetaTags } from '../lib/tags/meta.tags';
import { Templating } from '../lib/templating/templating.tag';
import { PaoTags } from '../lib/pao/pao.tags';
import { BundleTags } from '../lib/bundle/temp';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService {


  constructor(private readonly hub: EventHubService) {
    this.hub.currentWorkspace.subscribe((w) => {
      if (w) { this.updateGlossary(w); }
    });

    this.hub.onWorkspaceUpdated.subscribe( (w)=> {
      if (w) { this.updateGlossary(w); }
    });

    this.hub.currentGlossary.next(new Glossary(MetaTags.metadata, Templating.metadata, PaoTags.metadata, BundleTags.metadata));
  }

  mergeAll(workspace: IWorkspace): string {
    if(workspace){
    return '\n'.concat(...workspace.resources.filter(x => x.type === 'glossary').map(x => x.content));
    }
    else{
      return "";
    }
  }

  private updateGlossary(workspace: IWorkspace) {
    try {
      const data = readGlossaryFromYaml(this.mergeAll(workspace));
      fixTagsDeclaration(data);
      const glossary = new Glossary(MetaTags.metadata, Templating.metadata, PaoTags.metadata , BundleTags.metadata, data);
      this.hub.currentGlossary.next(glossary);

    } catch (exception) {
      this.hub.onError.next("fix the glossary");
      console.error(exception);
    } 
  }
}