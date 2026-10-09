/**
 * DataSource for the TypeORM CLI. Compiled by `npm run db:build` into
 * `dist/db` and used by the `migration:*` scripts.
 */
import 'reflect-metadata';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { DataSource } from 'typeorm';
import { databaseOptions } from './database.config.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export default new DataSource({
  ...databaseOptions(),
  migrations: [path.join(here, 'migrations', '*.js')],
});
