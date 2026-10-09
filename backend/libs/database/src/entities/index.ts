import { AdminUser } from './admin-user.entity.js';
import { District } from './district.entity.js';
import { Language } from './language.entity.js';
import { PostOffice } from './post-office.entity.js';
import { Region } from './region.entity.js';
import { Setting } from './setting.entity.js';
import { User } from './user.entity.js';
import { UserIdentity } from './user-identity.entity.js';

export * from './base.entity.js';
export * from './translatable.js';
export * from './admin-user.entity.js';
export * from './district.entity.js';
export * from './language.entity.js';
export * from './post-office.entity.js';
export * from './region.entity.js';
export * from './setting.entity.js';
export * from './user.entity.js';
export * from './user-identity.entity.js';

/** Registered explicitly (no globs) so bundled apps and the CLI see the same list. */
export const ENTITIES = [
  AdminUser,
  District,
  Language,
  PostOffice,
  Region,
  Setting,
  User,
  UserIdentity,
];
