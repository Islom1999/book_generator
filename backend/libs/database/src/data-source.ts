/**
 * DataSource for the TypeORM CLI. Compiled by `npm run db:build` into
 * `dist/db` and used by the `migration:*` scripts. Entities are imported by
 * relative path on purpose: plain `tsc` output can't resolve `@app/entities`.
 */
import 'reflect-metadata';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { DataSource } from 'typeorm';
import { ENTITIES } from '../../entities/src/index.js';
import { databaseOptions } from './database.config.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export default new DataSource({
  ...databaseOptions(ENTITIES),
  migrations: [path.join(here, 'migrations', '*.js')],
});
