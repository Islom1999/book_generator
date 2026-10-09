import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private readonly books: Repository<Book>) {}

  listPublic() {
    return this.books.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  listAll() {
    return this.books.find({ order: { createdAt: 'DESC' } });
  }

  async getBySlug(slug: string) {
    const book = await this.books.findOne({ where: { slug, isActive: true } });
    if (!book) throw new NotFoundException('Kitob topilmadi');
    return book;
  }

  async getById(id: string) {
    const book = await this.books.findOne({ where: { id } });
    if (!book) throw new NotFoundException('Kitob topilmadi');
    return book;
  }

  create(dto: CreateBookDto) {
    return this.books.save(this.books.create(dto));
  }

  async update(id: string, dto: Partial<CreateBookDto>) {
    const book = await this.getById(id);
    Object.assign(book, dto);
    return this.books.save(book);
  }

  async remove(id: string) {
    const book = await this.getById(id);
    book.isActive = false;
    return this.books.save(book);
  }
}
