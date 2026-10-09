import {
  applyDecorators,
  createParamDecorator,
  type ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import type { AdminRole } from '@app/entities';
import {
  ADMIN_ROLES_KEY,
  AdminAuthGuard,
  UserAuthGuard,
} from '../guards/auth.guard.js';
import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';

/** Requires an admin token; with roles, also one of those roles (super_admin always passes). */
export const AdminAuth = (...roles: AdminRole[]) =>
  applyDecorators(
    SetMetadata(ADMIN_ROLES_KEY, roles),
    UseGuards(AdminAuthGuard),
  );

/** Requires a customer token. */
export const UserAuth = () => UseGuards(UserAuthGuard);

/** The verified JWT payload of the current request. */
export const Auth = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<{ auth?: JwtPayload }>().auth,
);
