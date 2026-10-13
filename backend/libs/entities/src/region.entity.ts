import { Column, Entity, OneToMany, type Relation } from 'typeorm';
import { CostumBaseEntity } from './base.entity.js';
import type { Translatable } from './translatable.js';
import { District } from './district.entity.js';

/** Viloyat (and Tashkent city / Karakalpakstan). */
@Entity('regions')
export class Region extends CostumBaseEntity {
  @Column({ type: 'jsonb' })
  name: Translatable;

  /** Optional SOATO / internal code. */
  @Column({ type: 'varchar', length: 32, nullable: true })
  code: string | null;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => District, (district) => district.region)
  districts: Relation<District[]>;
}
