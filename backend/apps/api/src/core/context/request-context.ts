import { AsyncLocalStorage } from 'node:async_hooks';

/** Who is making the current request; filled by the auth guards. */
export interface RequestContext {
  ip?: string;
  admin?: {
    id: string;
    is_super_admin: boolean;
    permissions: ReadonlySet<string>;
  };
  userId?: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

/** Express middleware: one context per request. */
export function requestContextMiddleware(
  req: { ip?: string },
  _res: unknown,
  next: () => void,
) {
  storage.run({ ip: req.ip }, next);
}

/** The current request's context (an empty one outside requests: worker, tests). */
export function requestContext(): RequestContext {
  return storage.getStore() ?? {};
}

/** Runs `fn` with the given context (tests, background jobs acting as an admin). */
export function runWithContext<T>(context: RequestContext, fn: () => T): T {
  return storage.run(context, fn);
}
