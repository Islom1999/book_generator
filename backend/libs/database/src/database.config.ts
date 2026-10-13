import type { DataSourceOptions } from 'typeorm';

/**
 * Connection options shared by the Nest apps and the migration CLI. Entities
 * are passed in by the caller so this file has no `@app/*` imports (the CLI
 * build is plain `tsc`, which doesn't rewrite path aliases).
 */
export function databaseOptions(
  entities: DataSourceOptions['entities'],
  env: NodeJS.ProcessEnv = process.env,
): DataSourceOptions {
  return {
    type: 'postgres',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 55433),
    username: env.DB_USER ?? 'ertaklar',
    password: env.DB_PASSWORD ?? 'ertaklar',
    database: env.DB_NAME ?? 'ertaklar_app',
    entities,
    // Schema changes go through migrations only (`npm run migration:*`).
    synchronize: false,
    logging: env.DB_LOGGING === 'true',
  };
}
