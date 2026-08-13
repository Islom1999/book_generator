import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { Book } from './entities/book.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { Personalization } from './entities/personalization.entity';
import { User } from './entities/user.entity';
import { OpenRouterModule } from './openrouter/openrouter.module';
import { ReplicateModule } from './replicate/replicate.module';
import { OrdersModule } from './orders/orders.module';
import { PersonalizationsModule } from './personalizations/personalizations.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.get('DB_USER', 'ertaklar'),
        password: config.get('DB_PASSWORD', 'ertaklar'),
        database: config.get('DB_NAME', 'ertaklar'),
        entities: [User, Book, Personalization, Order, OrderItem],
        synchronize: true,
      }),
    }),
    OpenRouterModule,
    ReplicateModule,
    AuthModule,
    BooksModule,
    PersonalizationsModule,
    OrdersModule,
    SeedModule,
  ],
})
export class AppModule {}
