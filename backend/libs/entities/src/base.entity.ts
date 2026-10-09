import {
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

/**
 * Parent of every entity. Property names are snake_case on purpose: they are
 * the JSON contract the Fuse admin panel expects (`IBaseModel`, which also
 * carries `version_id`).
 */
export abstract class CostumBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @VersionColumn({ type: 'int', default: 1 })
  version_id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Index()
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;
}
