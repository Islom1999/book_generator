import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { AdminUser } from './admin-user.entity.js';
import { CostumBaseEntity } from './base.entity.js';

/** Append-only record of every admin action (BUSINESS_LOGIC §9). */
@Entity('audit_logs')
@Index(['entity', 'entity_id'])
export class AuditLog extends CostumBaseEntity {
  /** Null for system actions (cron, worker). */
  @Index()
  @Column({ type: 'uuid', nullable: true })
  admin_id: string | null;

  @ManyToOne(() => AdminUser, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: Relation<AdminUser> | null;

  /** `create`, `update`, `delete`, `restore` or a domain action like `order.cancel`. */
  @Column({ type: 'varchar', length: 64 })
  action: string;

  /** Table name of the changed record. */
  @Column({ type: 'varchar', length: 64 })
  entity: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  entity_id: string | null;

  @Column({ type: 'jsonb', nullable: true })
  before: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  after: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ip: string | null;
}
