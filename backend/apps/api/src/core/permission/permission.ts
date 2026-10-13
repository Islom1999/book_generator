import { ForbiddenException } from '@nestjs/common';
import { requestContext } from '../context/request-context.js';
import type { Permission } from './permission.catalog.js';

/** Whether the current admin has the key (super admins have every key). */
export function hasPermission(key: Permission) {
  const admin = requestContext().admin;
  return !!admin && (admin.is_super_admin || admin.permissions.has(key));
}

/** For checks finer than a route, e.g. one field of a DTO. */
export function assertPermission(key: Permission) {
  if (!hasPermission(key)) {
    throw new ForbiddenException(`Missing permission: ${key}`);
  }
}
