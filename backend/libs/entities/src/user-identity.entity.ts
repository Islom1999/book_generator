import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { CostumBaseEntity } from './base.entity.js';
import { User } from './user.entity.js';

export enum AuthProvider {
  GOOGLE = 'google',
  TELEGRAM = 'telegram',
}

/** One login method linked to a user (a user can link both Google and Telegram). */
@Entity('user_identities')
@Index(['provider', 'provider_user_id'], { unique: true })
export class UserIdentity extends CostumBaseEntity {
  @Column({ type: 'enum', enum: AuthProvider })
  provider: AuthProvider;

  /** Google `sub` or Telegram user id. */
  @Column({ type: 'varchar', length: 128 })
  provider_user_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.identities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  /** Profile as the provider returned it, for support/debugging. */
  @Column({ type: 'jsonb', default: {} })
  profile: Record<string, unknown>;
}
