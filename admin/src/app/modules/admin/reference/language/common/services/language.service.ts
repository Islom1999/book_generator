import { Injectable } from '@angular/core'
import { BaseCrudService } from 'app/shared/services/base-crud.service'
import { ILanguage } from '../models/language.model'

@Injectable({ providedIn: 'root' })
export class LanguageService extends BaseCrudService<ILanguage> {
  constructor() {
    super('admin/languages')
  }
}
