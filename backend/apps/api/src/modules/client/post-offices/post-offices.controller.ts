import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostOffice } from '@app/entities';
import { BaseClientController } from '../../../core/base/base_class_client/base.controller.js';
import { ClientPostOfficesService } from './post-offices.service.js';

/** Public: reference data for the storefront. */
@ApiTags('client / post-offices')
@Controller('post-offices')
export class ClientPostOfficesController extends BaseClientController<PostOffice> {
  constructor(service: ClientPostOfficesService) {
    super(service);
  }
}
