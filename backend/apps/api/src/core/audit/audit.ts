import { AuditLog } from '@app/entities';
import type { EntityManager } from 'typeorm';
import { requestContext } from '../context/request-context.js';

export interface AuditEntry {
  action: string;
  entity: string;
  entity_id?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
}

const SECRET = /password|token|secret/i;

/** Drops secrets and relation objects; keeps plain column values. */
export function auditSnapshot(
  value: object | null | undefined,
  keys?: string[],
): Record<string, unknown> | null {
  if (!value) {
    return null;
  }
  const snapshot: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(value)) {
    if (keys && !keys.includes(key)) {
      continue;
    }
    if (SECRET.test(key)) {
      snapshot[key] = '***';
      continue;
    }
    const isRelation =
      field !== null &&
      typeof field === 'object' &&
      !(field instanceof Date) &&
      ('id' in field || (Array.isArray(field) && typeof field[0] === 'object'));
    if (!isRelation) {
      snapshot[key] = field;
    }
  }
  return snapshot;
}

/**
 * Writes one audit row with the acting admin and IP from the request context.
 * Pass the transaction's manager so the row commits with the change.
 */
export async function writeAudit(manager: EntityManager, entry: AuditEntry) {
  const context = requestContext();
  const row = manager.create(AuditLog, {
    admin_id: context.admin?.id ?? null,
    ip: context.ip ?? null,
    action: entry.action,
    entity: entry.entity,
    entity_id: entry.entity_id ?? null,
    before: entry.before ?? null,
    after: entry.after ?? null,
  });
  await manager.save(row);
}
