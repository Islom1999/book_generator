import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Personalization } from '../entities/personalization.entity';
import { PersonalizationsService } from '../personalizations/personalizations.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(Personalization)
    private readonly personalizations: Repository<Personalization>,
    private readonly personalizationService: PersonalizationsService,
  ) {}

  async create(dto: CreateOrderDto) {
    const items: OrderItem[] = [];
    let total = 0;
    for (const it of dto.items) {
      const p = await this.personalizations.findOne({
        where: { id: it.personalizationId, deletedAt: IsNull() },
      });
      if (!p) throw new NotFoundException('Shaxsiylashtirish topilmadi');
      total += p.book.price;
      const item = new OrderItem();
      item.book = p.book;
      item.personalization = p;
      item.price = p.book.price;
      items.push(item);
      void this.personalizationService.generateFull(p.id);
    }
    const order = this.orders.create({
      customerName: dto.customerName,
      phone: dto.phone,
      city: dto.city,
      address: dto.address,
      paymentMethod: dto.paymentMethod || 'cash',
      status: 'new',
      total,
      items,
    });
    return this.orders.save(order);
  }

  list() {
    return this.orders.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    order.status = status;
    return this.orders.save(order);
  }
}
