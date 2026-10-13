import { Global, Module } from '@nestjs/common';
import { createStorageDriver } from './storage.service.js';

/** Injection token for the configured `StorageDriver`. */
export const STORAGE = Symbol('STORAGE');

@Global()
@Module({
  providers: [{ provide: STORAGE, useFactory: () => createStorageDriver() }],
  exports: [STORAGE],
})
export class StorageModule {}
