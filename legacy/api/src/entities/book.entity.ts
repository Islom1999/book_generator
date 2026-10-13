import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  titleUz: string;

  @Column()
  titleRu: string;

  @Column('text')
  descUz: string;

  @Column('text')
  descRu: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ default: '3–6' })
  ageRange: string;

  @Column({ type: 'int', default: 8 })
  pageCount: number;

  @Column({ type: 'int', default: 3 })
  freePages: number;

  @Column({ type: 'varchar', nullable: true })
  badge: string | null;

  @Column({ type: 'varchar', nullable: true })
  gender: string | null;

  @Column({ type: 'int', default: 262 })
  hue: number;

  @Column({ default: '📖' })
  emoji: string;

  @Column({ type: 'varchar', nullable: true })
  coverUrl: string | null;

  @Column('text')
  themePrompt: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  templatePages: {
    pageNumber: number;
    imageUrl: string;
    textUz: string;
    textRu: string;
    scene: string;
    hasChild?: boolean;
  }[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
