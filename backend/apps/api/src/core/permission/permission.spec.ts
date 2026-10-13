import { ForbiddenException } from '@nestjs/common';
import { assertCanGrant } from '../../modules/admin/admin-roles/admin-roles.service.js';
import { auditSnapshot } from '../audit/audit.js';
import { runWithContext } from '../context/request-context.js';
import { hasPermission } from './permission.js';

const admin = (permissions: string[], is_super_admin = false) => ({
  admin: { id: 'a', is_super_admin, permissions: new Set(permissions) },
});

describe('permissions', () => {
  it('super admin has every key', () => {
    runWithContext(admin([], true), () => {
      expect(hasPermission('wallet.adjust')).toBe(true);
    });
  });

  it('regular admin has only role keys', () => {
    runWithContext(admin(['orders.view']), () => {
      expect(hasPermission('orders.view')).toBe(true);
      expect(hasPermission('orders.cancel')).toBe(false);
    });
  });

  it('nobody outside a request', () => {
    expect(hasPermission('orders.view')).toBe(false);
  });

  it('an admin cannot grant keys they lack', () => {
    runWithContext(admin(['orders.view', 'roles.manage']), () => {
      expect(() => assertCanGrant(['orders.view'])).not.toThrow();
      expect(() => assertCanGrant(['orders.view', 'wallet.adjust'])).toThrow(
        ForbiddenException,
      );
    });
  });
});

describe('auditSnapshot', () => {
  it('masks secrets and drops relations', () => {
    expect(
      auditSnapshot({
        email: 'a@b.uz',
        password_hash: 'x',
        role: { id: 'r', name: {} },
        name: { uz: 'A' },
        created_at: new Date(0),
      }),
    ).toEqual({
      email: 'a@b.uz',
      password_hash: '***',
      name: { uz: 'A' },
      created_at: new Date(0),
    });
  });

  it('keeps only the given keys', () => {
    expect(auditSnapshot({ a: 1, b: 2 }, ['b'])).toEqual({ b: 2 });
  });
});
