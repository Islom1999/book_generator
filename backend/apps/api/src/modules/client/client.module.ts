import { Module } from '@nestjs/common';
import { ClientDistrictsModule } from './districts/districts.module.js';
import { ClientLanguagesModule } from './languages/languages.module.js';
import { ClientPostOfficesModule } from './post-offices/post-offices.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { ClientRegionsModule } from './regions/regions.module.js';

/** Every storefront (`/api/*`, non-admin) module. */
@Module({
  imports: [
    ClientDistrictsModule,
    ClientLanguagesModule,
    ClientPostOfficesModule,
    ClientRegionsModule,
    ProfileModule,
  ],
})
export class ClientModule {}
