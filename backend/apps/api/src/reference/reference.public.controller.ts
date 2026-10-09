import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  DistrictsService,
  LanguagesService,
  PostOfficesService,
  RegionsService,
} from './reference.services.js';

/** Read-only reference data for the storefront (language switcher, address form). */
@Controller()
export class ReferencePublicController {
  constructor(
    private readonly languages: LanguagesService,
    private readonly regions: RegionsService,
    private readonly districts: DistrictsService,
    private readonly postOffices: PostOfficesService,
  ) {}

  @Get('languages')
  listLanguages() {
    return this.languages.findActive();
  }

  @Get('regions')
  listRegions() {
    return this.regions.findActive();
  }

  @Get('regions/:id/districts')
  listDistricts(@Param('id', ParseUUIDPipe) regionId: string) {
    return this.districts.findActiveByRegion(regionId);
  }

  @Get('districts/:id/post-offices')
  listPostOffices(@Param('id', ParseUUIDPipe) districtId: string) {
    return this.postOffices.findActiveByDistrict(districtId);
  }
}
