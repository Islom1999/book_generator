import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity.js';

@Entity('languages')
export class Language extends BaseEntity {
  /** ISO code, e.g. `uz`, `ru`, `en`. */
  @Index({ unique: true, where: 'deleted_at IS NULL' })
  @Column({ type: 'varchar', length: 8 })
  code: string;

  /** Name in English, for admins. */
  @Column({ type: 'varchar', length: 64 })
  name: string;

  /** Name in the language itself, for the language switcher. */
  @Column({ type: 'varchar', length: 64 })
  native_name: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}
