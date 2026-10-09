import { Column, Entity, Index, OneToMany, type Relation } from 'typeorm';
import { CostumBaseEntity } from './base.entity.js';
import { UserIdentity } from './user-identity.entity.js';

/** A customer (parent) of the storefront. */
@Entity('users')
export class User extends CostumBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  /**
   * Verified phone number (E.164). The free-trial limit is tied to it, so one
   * person cannot farm trials with many Google/Telegram accounts.
   */
  @Index({ unique: true, where: 'phone IS NOT NULL AND deleted_at IS NULL' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatar_url: string | null;

  /** Preferred language code (references `languages.code`). */
  @Column({ type: 'varchar', length: 8, nullable: true })
  locale: string | null;

  @Column({ type: 'boolean', default: false })
  is_blocked: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  last_login_at: Date | null;

  @OneToMany(() => UserIdentity, (identity) => identity.user)
  identities: Relation<UserIdentity[]>;
}
