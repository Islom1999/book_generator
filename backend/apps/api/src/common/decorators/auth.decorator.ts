import {
  applyDecorators,
  createParamDecorator,
  type ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import type { Permission } from '../../core/permission/permission.catalog.js';
import {
  ADMIN_PERMISSIONS_KEY,
  ADMIN_READ_PERMISSIONS_KEY,
  AdminAuthGuard,
  READ_ROUTE_KEY,
  UserAuthGuard,
} from '../guards/auth.guard.js';
import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';

/**
 * Requires an admin token and any of the given permission keys (none = any
 * active admin). On a method it overrides the class-level keys.
 */
export const AdminAuth = (...permissions: Permission[]) =>
  applyDecorators(
    SetMetadata(ADMIN_PERMISSIONS_KEY, permissions),
    UseGuards(AdminAuthGuard),
  );

/** Method-level keys replacing the class-level `@AdminAuth` keys (no second guard). */
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(ADMIN_PERMISSIONS_KEY, permissions);

/**
 * Extra keys that also open the read-only routes (list, detail) of a
 * controller, e.g. `admins.view` next to `@AdminAuth('admins.manage')`.
 */
export const AdminReadAuth = (...permissions: Permission[]) =>
  SetMetadata(ADMIN_READ_PERMISSIONS_KEY, permissions);

/** Marks a route as read-only so `AdminReadAuth` keys apply to it. */
export const ReadRoute = () => SetMetadata(READ_ROUTE_KEY, true);

/** Requires a customer token. */
export const UserAuth = () => UseGuards(UserAuthGuard);

/** The verified JWT payload of the current request. */
export const Auth = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<{ auth?: JwtPayload }>().auth,
);
