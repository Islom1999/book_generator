import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AdminUser, User } from '@app/entities';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { requestContext } from '../../core/context/request-context.js';
import type { JwtPayload } from '../interfaces/jwt-payload.interface.js';

export const ADMIN_PERMISSIONS_KEY = 'admin_permissions';
export const ADMIN_READ_PERMISSIONS_KEY = 'admin_read_permissions';
export const READ_ROUTE_KEY = 'admin_read_route';

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
    protected readonly dataSource: DataSource,
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

  protected abstract authorize(
    payload: JwtPayload,
    context: ExecutionContext,
  ): Promise<boolean>;
}

/**
 * Admin panel requests. The admin and their role are loaded on every request,
 * so blocking an admin or editing a role takes effect immediately
 * (BUSINESS_LOGIC §9). A route passes when the admin has any of the required
 * permission keys; super admins pass everything.
 */
@Injectable()
export class AdminAuthGuard extends JwtGuard {
  protected readonly kind = 'admin';

  protected async authorize(payload: JwtPayload, context: ExecutionContext) {
    const admin = await this.dataSource.getRepository(AdminUser).findOne({
      where: { id: payload.sub, is_active: true },
      relations: { role: true },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }
    const permissions = new Set(
      admin.role?.is_active ? admin.role.permissions : [],
    );
    requestContext().admin = {
      id: admin.id,
      is_super_admin: admin.is_super_admin,
      permissions,
    };
    if (admin.is_super_admin) {
      return true;
    }
    const targets = [context.getHandler(), context.getClass()];
    const required = [
      ...(this.reflector.getAllAndOverride<string[] | undefined>(
        ADMIN_PERMISSIONS_KEY,
        targets,
      ) ?? []),
    ];
    if (this.reflector.get<boolean>(READ_ROUTE_KEY, context.getHandler())) {
      required.push(
        ...(this.reflector.getAllAndOverride<string[] | undefined>(
          ADMIN_READ_PERMISSIONS_KEY,
          targets,
        ) ?? []),
      );
    }
    if (required.length && !required.some((key) => permissions.has(key))) {
      throw new ForbiddenException();
    }
    return true;
  }
}

/** Storefront (customer) requests. Blocked customers are rejected immediately. */
@Injectable()
export class UserAuthGuard extends JwtGuard {
  protected readonly kind = 'user';

  protected async authorize(payload: JwtPayload) {
    const user = await this.dataSource
      .getRepository(User)
      .findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.is_blocked) {
      throw new ForbiddenException('Account is blocked');
    }
    requestContext().userId = user.id;
    return true;
  }
}
