import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Book } from './book.entity';
import { Personalization } from './personalization.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Book, { eager: true })
  book: Book;

  @ManyToOne(() => Personalization, { eager: true, nullable: true })
  personalization: Personalization | null;

  @Column({ type: 'int' })
  price: number;
}
