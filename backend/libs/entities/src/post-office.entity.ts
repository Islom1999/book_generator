import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { CostumBaseEntity } from './base.entity.js';
import type { Translatable } from './translatable.js';
import { District } from './district.entity.js';

/** Post office / pickup point where a printed book can be delivered. */
@Entity('post_offices')
export class PostOffice extends CostumBaseEntity {
  /** Postal index, e.g. `100000`. */
  @Index({ unique: true, where: 'deleted_at IS NULL' })
  @Column({ type: 'varchar', length: 10 })
  postal_code: string;

  @Column({ type: 'jsonb' })
  name: Translatable;

  @Column({ type: 'jsonb', nullable: true })
  address: Translatable | null;

  @Column({ type: 'uuid' })
  district_id: string;

  @ManyToOne(() => District, (district) => district.post_offices, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'district_id' })
  district: Relation<District>;

  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
