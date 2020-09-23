import { Injectable } from '@angular/core';
import { GlossaryService } from './glossary.service';
import { PaoTags } from '../lib/pao/pao.tags';
import { Templating } from '../lib/templating/templating.tag';
import { PaoContext } from '../lib/pao/PaoContext';
import { MainContext } from '../lib/MainContext';
import { TagExpression } from '../lib/tags/TagExpression';

@Injectable({
  providedIn: 'root'
})
export class ExportsService {

  constructor(private readonly glossaryService: GlossaryService) {

  }
}
