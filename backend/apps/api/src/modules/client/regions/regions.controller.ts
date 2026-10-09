import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Region } from '@app/entities';
import { BaseClientController } from '../../../core/base/base_class_client/base.controller.js';
import { ClientRegionsService } from './regions.service.js';

/** Public: reference data for the storefront. */
@ApiTags('client / regions')
@Controller('regions')
export class ClientRegionsController extends BaseClientController<Region> {
  constructor(service: ClientRegionsService) {
    super(service);
  }
}
