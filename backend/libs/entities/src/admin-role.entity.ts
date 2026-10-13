import { Column, Entity } from 'typeorm';
import { CostumBaseEntity } from './base.entity.js';
import type { Translatable } from './translatable.js';

/**
 * A set of permission keys created in the admin panel (BUSINESS_LOGIC §9).
 * Keys come from the API's permission catalog; endpoints check keys, never
 * role names.
 */
@Entity('admin_roles')
export class AdminRole extends CostumBaseEntity {
  @Column({ type: 'jsonb' })
  name: Translatable;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  permissions: string[];

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
