import { Column, Entity, Index } from 'typeorm';
import { CostumBaseEntity } from './base.entity.js';

export enum FileKind {
  /** Customer upload of a child's face; deleted after the retention period. */
  CHILD_PHOTO = 'child_photo',
  /** Base illustration or cover art of a book template (admin upload). */
  TEMPLATE_IMAGE = 'template_image',
  /** AI-generated page (full resolution, private). */
  PAGE_IMAGE = 'page_image',
  /** Print-ready file for the printing partner. */
  PRINT_FILE = 'print_file',
}

/**
 * Metadata of an object in private storage. Customers never get `key`
 * directly: the API serves `preview_key` (small, watermarked) through
 * short-lived signed URLs (BUSINESS_LOGIC §11).
 */
@Entity('files')
export class StoredFile extends CostumBaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 512 })
  key: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  preview_key: string | null;

  @Column({ type: 'varchar', length: 32 })
  kind: FileKind;

  @Column({ type: 'varchar', length: 64 })
  mime_type: string;

  @Column({ type: 'int' })
  size_bytes: number;

  @Column({ type: 'int', nullable: true })
  width: number | null;

  @Column({ type: 'int', nullable: true })
  height: number | null;

  /** Owning customer for customer uploads. */
  @Index()
  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  /** When the retention job removes the object (child photos). */
  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  delete_after: Date | null;
}
