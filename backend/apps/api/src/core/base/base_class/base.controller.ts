import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  type Type,
  ValidationPipe,
} from '@nestjs/common';
import type { CostumBaseEntity } from '@app/entities';
import { PrimeTableQuerySwaggerDTO } from '../base.interface.js';
import type { BaseAdminService } from './base.service.js';

const bodyValidation = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

/**
 * Admin REST endpoints, the routes the Fuse admin `BaseCrudService` calls:
 *
 * | Route                         | Admin method          |
 * | ----------------------------- | --------------------- |
 * | `POST   /`                    | `create()`            |
 * | `GET    /`                    | `getAll()`            |
 * | `POST   /pagination`          | `getAllPagination()`  |
 * | `POST   /pagination/archive`  | archive view          |
 * | `GET    /:id`                 | `getById(id)`         |
 * | `GET    /archive/:id`         | `getById(id, true)`   |
 * | `PUT    /:id`                 | `update()`            |
 * | `DELETE /:id`                 | `delete()` (soft)     |
 * | `GET    /repair/:id`          | `repair(id)`          |
 *
 * Subclasses return their DTO classes from `dtoClassCreate()` and
 * `dtoClassUpdate()`; request bodies are validated against them here.
 * Guards (`@AdminAuth`) go on the subclass.
 */
export abstract class BaseAdminController<
  M extends CostumBaseEntity,
  D extends object,
  U extends object,
> {
  protected constructor(
    protected readonly service: BaseAdminService<M, D, U>,
  ) {}

  protected abstract dtoClassCreate(): Type<D>;
  protected abstract dtoClassUpdate(): Type<U>;

  @Post()
  async create(@Body() body: unknown) {
    return this.service.create(
      await this.validate(this.dtoClassCreate(), body),
    );
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post('pagination')
  @HttpCode(200)
  findAllPaginationPost(@Body() query: PrimeTableQuerySwaggerDTO) {
    return this.service.findAllPaginationPost(query);
  }

  @Post('pagination/archive')
  @HttpCode(200)
  findAllPaginationArchive(@Body() query: PrimeTableQuerySwaggerDTO) {
    return this.service.findAllPaginationPost(query, true);
  }

  @Get('archive/:id')
  findOneArchive(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id, true);
  }

  @Get('repair/:id')
  repair(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.repair(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: unknown) {
    return this.service.update(
      id,
      await this.validate(this.dtoClassUpdate(), body),
    );
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete(id);
  }

  private validate<T>(metatype: Type<T>, body: unknown): Promise<T> {
    return bodyValidation.transform(body, { type: 'body', metatype });
  }
}
