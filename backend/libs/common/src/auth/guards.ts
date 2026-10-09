import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AdminRole } from '@app/database';
import type { Request } from 'express';
import type { JwtPayload } from './jwt-payload.js';

export const ADMIN_ROLES_KEY = 'admin_roles';

function bearerToken(request: Request) {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

@Injectable()
abstract class JwtGuard implements CanActivate {
  protected abstract readonly kind: JwtPayload['kind'];

  constructor(
    protected readonly jwt: JwtService,
    protected readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { auth?: JwtPayload }>();
    const token = bearerToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }
    if (payload.kind !== this.kind) {
      throw new UnauthorizedException();
    }
    request.auth = payload;
    return this.authorize(payload, context);
  }

  protected authorize(_payload: JwtPayload, _context: ExecutionContext) {
    return true;
  }
}

/** Admin panel requests. `super_admin` passes every role check. */
@Injectable()
export class AdminAuthGuard extends JwtGuard {
  protected readonly kind = 'admin';

  protected override authorize(payload: JwtPayload, context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<AdminRole[] | undefined>(
      ADMIN_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (
      payload.kind === 'admin' &&
      roles?.length &&
      payload.role !== AdminRole.SUPER_ADMIN &&
      !roles.includes(payload.role)
    ) {
      throw new ForbiddenException();
    }
    return true;
  }
}

/** Storefront (customer) requests. */
@Injectable()
export class UserAuthGuard extends JwtGuard {
  protected readonly kind = 'user';
}
