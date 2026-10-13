import { Column, Entity, Index } from 'typeorm';
import { CostumBaseEntity } from './base.entity.js';

/**
 * Runtime-editable settings (prices, trial limits, AI budget...).
 * Keys and defaults: `SETTING_DEFAULTS` in `setting-keys.ts`.
 */
@Entity('settings')
export class Setting extends CostumBaseEntity {
  @Index({ unique: true, where: 'deleted_at IS NULL' })
  @Column({ type: 'varchar', length: 128 })
  key: string;

  @Column({ type: 'jsonb' })
  value: unknown;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
