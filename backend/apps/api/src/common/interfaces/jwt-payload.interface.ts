/** Permissions are not in the token: they are loaded per request. */
export interface AdminJwtPayload {
  sub: string;
  kind: 'admin';
}

export interface UserJwtPayload {
  sub: string;
  kind: 'user';
}

export type JwtPayload = AdminJwtPayload | UserJwtPayload;
