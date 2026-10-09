import { Module } from '@nestjs/common';
import { AdminUsersModule } from './admin-users/admin-users.module.js';
import { CustomersModule } from './customers/customers.module.js';
import { DistrictsModule } from './districts/districts.module.js';
import { LanguagesModule } from './languages/languages.module.js';
import { PostOfficesModule } from './post-offices/post-offices.module.js';
import { RegionsModule } from './regions/regions.module.js';
import { SettingsModule } from './settings/settings.module.js';

/** Every `/api/admin/*` module. */
@Module({
  imports: [
    AdminUsersModule,
    CustomersModule,
    DistrictsModule,
    LanguagesModule,
    PostOfficesModule,
    RegionsModule,
    SettingsModule,
  ],
})
export class AdminModule {}
