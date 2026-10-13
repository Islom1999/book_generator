/** BullMQ queue names shared by the API (producer) and the worker (consumer). */
export const Queues = {
  /** AI page generation for trial previews and paid orders. */
  GENERATION: 'generation',
  /** Upscaling and print-ready PDF assembly. */
  PRINT: 'print',
  /** Telegram / SMS notifications. */
  NOTIFICATIONS: 'notifications',
} as const;

export function redisConnection(env: NodeJS.ProcessEnv = process.env) {
  return {
    host: env.REDIS_HOST ?? 'localhost',
    port: Number(env.REDIS_PORT ?? 6379),
    password: env.REDIS_PASSWORD || undefined,
  };
}
