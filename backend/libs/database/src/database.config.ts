import type { DataSourceOptions } from 'typeorm';
import { ENTITIES } from './entities/index.js';

/** Connection options shared by the Nest apps and the migration CLI. */
export function databaseOptions(
  env: NodeJS.ProcessEnv = process.env,
): DataSourceOptions {
  return {
    type: 'postgres',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 55433),
    username: env.DB_USER ?? 'ertaklar',
    password: env.DB_PASSWORD ?? 'ertaklar',
    database: env.DB_NAME ?? 'ertaklar_app',
    entities: ENTITIES,
    // Schema changes go through migrations only (`npm run migration:*`).
    synchronize: false,
    logging: env.DB_LOGGING === 'true',
  };
}
