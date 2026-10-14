// PM2 processes for Ertaklar (see deploy/README.md). Started by
// deploy/server-deploy.sh; secrets and DB/Redis settings come from
// /root/ertaklar/.env via node's --env-file (values set here win over the file).
const ROOT = '/root/book_generator';
const ENV_FILE = '/root/ertaklar/.env';

const backend = (name, entry, extraEnv = {}) => ({
  name,
  cwd: `${ROOT}/backend`,
  script: entry,
  node_args: `--env-file=${ENV_FILE}`,
  exec_mode: 'fork',
  instances: 1,
  autorestart: true,
  max_memory_restart: '768M',
  kill_timeout: 10000,
  env: { NODE_ENV: 'production', ...extraEnv },
});

module.exports = {
  apps: [
    backend('ertaklar-v2-api', 'dist/apps/api/main.js', { PORT: '3700' }),
    backend('ertaklar-v2-worker', 'dist/apps/worker/main.js'),
    // Exits immediately without TELEGRAM_BOT_TOKEN, so server-deploy.sh only
    // starts it when the token is set.
    backend('ertaklar-v2-bot', 'dist/apps/bot/main.js'),
    {
      name: 'ertaklar-v2-client',
      cwd: `${ROOT}/client`,
      script: 'dist/client/server/server.mjs',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: '4010',
        ALLOWED_HOSTS: 'ertaklar.anisaplus.uz,localhost,127.0.0.1',
      },
    },
  ],
};
