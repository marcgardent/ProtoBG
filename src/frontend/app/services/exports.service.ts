import { Injectable } from '@angular/core';
import { GlossaryService } from 'src/frontend/app/services/glossary.service';

@Injectable({
  providedIn: 'root'
})
export class ExportsService {

  constructor(private readonly glossaryService: GlossaryService) {

  }
}
