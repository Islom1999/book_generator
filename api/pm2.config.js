module.exports = {
  apps: [
    {
      name: 'ertaklar-api',
      cwd: '/root/book_generator/api',
      script: 'npm',
      args: 'run start:prod',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      restart_delay: 5000,
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: 'production',
        PORT: 3510,
      },
    },
  ],
};
