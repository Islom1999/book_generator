import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  type Relation,
} from 'typeorm';
import { CostumBaseEntity } from './base.entity.js';
import type { Translatable } from './translatable.js';
import { Region } from './region.entity.js';
import { PostOffice } from './post-office.entity.js';

/** Tuman / shahar inside a region. */
@Entity('districts')
export class District extends CostumBaseEntity {
  @Column({ type: 'jsonb' })
  name: Translatable;

  @Column({ type: 'uuid' })
  region_id: string;

  @ManyToOne(() => Region, (region) => region.districts, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'region_id' })
  region: Relation<Region>;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => PostOffice, (office) => office.district)
  post_offices: Relation<PostOffice[]>;
}
