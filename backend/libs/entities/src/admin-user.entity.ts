import { Column, Entity, Index } from 'typeorm';
import { CostumBaseEntity } from './base.entity.js';

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
  OPERATOR = 'operator',
  LOGISTICS = 'logistics',
  FINANCE = 'finance',
}

@Entity('admin_users')
export class AdminUser extends CostumBaseEntity {
  @Index({ unique: true, where: 'deleted_at IS NULL' })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password_hash: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'enum', enum: AdminRole, default: AdminRole.OPERATOR })
  role: AdminRole;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  last_login_at: Date | null;
}
