import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { AdminRole } from './admin-role.entity.js';
import { CostumBaseEntity } from './base.entity.js';

@Entity('admin_users')
export class AdminUser extends CostumBaseEntity {
  @Index({ unique: true, where: 'deleted_at IS NULL' })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password_hash: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  /** Passes every permission check. At least one active super admin always exists. */
  @Column({ type: 'boolean', default: false })
  is_super_admin: boolean;

  @Column({ type: 'uuid', nullable: true })
  role_id: string | null;

  @ManyToOne(() => AdminRole, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Relation<AdminRole> | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  last_login_at: Date | null;
}
