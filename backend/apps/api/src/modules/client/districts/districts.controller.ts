import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { District } from '@app/entities';
import { BaseClientController } from '../../../core/base/base_class_client/base.controller.js';
import { ClientDistrictsService } from './districts.service.js';

/** Public: reference data for the storefront. */
@ApiTags('client / districts')
@Controller('districts')
export class ClientDistrictsController extends BaseClientController<District> {
  constructor(service: ClientDistrictsService) {
    super(service);
  }
}
