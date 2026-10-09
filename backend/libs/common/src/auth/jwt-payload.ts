import type { AdminRole } from '@app/database';

export interface AdminJwtPayload {
  sub: string;
  kind: 'admin';
  role: AdminRole;
}

export interface UserJwtPayload {
  sub: string;
  kind: 'user';
}

export type JwtPayload = AdminJwtPayload | UserJwtPayload;
