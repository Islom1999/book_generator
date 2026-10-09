import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Language } from '@app/entities';
import { BaseClientController } from '../../../core/base/base_class_client/base.controller.js';
import { ClientLanguagesService } from './languages.service.js';

/** Public: reference data for the storefront. */
@ApiTags('client / languages')
@Controller('languages')
export class ClientLanguagesController extends BaseClientController<Language> {
  constructor(service: ClientLanguagesService) {
    super(service);
  }
}
