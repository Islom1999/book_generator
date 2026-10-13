/** Fails fast at startup when required configuration is missing. */
export function validateEnv(env: Record<string, unknown>) {
  const required = [
    'JWT_SECRET',
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
  ];
  const missing = required.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  if (env.NODE_ENV === 'production' && String(env.JWT_SECRET).length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }
  return env;
}
