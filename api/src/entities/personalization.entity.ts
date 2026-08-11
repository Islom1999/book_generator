import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';

export type PersonalizationStatus =
  | 'generating_preview'
  | 'preview_ready'
  | 'generating_full'
  | 'ready'
  | 'failed';

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  templateImageUrl?: string | null;
  hasChild?: boolean;
  imageUrl: string | null;
}

@Entity('personalizations')
export class Personalization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book, { eager: true })
  book: Book;

  @Column()
  childName: string;

  @Column({ type: 'int' })
  childAge: number;

  @Column()
  gender: string;

  @Column()
  bookLang: string;

  @Column({ type: 'text', nullable: true })
  dedication: string | null;

  @Column()
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  characterDescription: string | null;

  @Column({ type: 'varchar', nullable: true })
  generatedTitle: string | null;

  @Column({ type: 'jsonb', default: [] })
  pages: StoryPage[];

  @Column({ default: 'generating_preview' })
  status: PersonalizationStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
