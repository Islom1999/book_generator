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
import type { BaseEntity } from '@app/database';
import type { DeepPartial } from 'typeorm';
import type { BaseCrudService } from './base-crud.service.js';
import { TableQueryDto } from './table-query.dto.js';

const validate = (expectedType: Type) =>
  new ValidationPipe({
    expectedType,
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

/**
 * Builds a controller base class exposing the routes the Fuse admin
 * `BaseCrudService` calls:
 *
 * | Route                         | Admin method          |
 * | ----------------------------- | --------------------- |
 * | `GET    /`                    | `getAll()`            |
 * | `POST   /pagination`          | `getAllPagination()`  |
 * | `POST   /pagination/archive`  | archive view          |
 * | `GET    /archive/:id`         | `getById(id, true)`   |
 * | `GET    /repair/:id`          | `repair(id)`          |
 * | `GET    /:id`                 | `getById(id)`         |
 * | `POST   /`                    | `create()`            |
 * | `PUT    /:id`                 | `update()`            |
 * | `DELETE /:id`                 | `delete()` (soft)     |
 */
export function CrudController<T extends BaseEntity>(dtos: {
  create: Type;
  update: Type;
}) {
  abstract class CrudControllerBase {
    abstract readonly service: BaseCrudService<T>;

    @Get()
    findAll() {
      return this.service.findAll();
    }

    @Post('pagination')
    @HttpCode(200)
    paginate(@Body() query: TableQueryDto) {
      return this.service.paginate(query);
    }

    @Post('pagination/archive')
    @HttpCode(200)
    paginateArchive(@Body() query: TableQueryDto) {
      return this.service.paginate(query, true);
    }

    @Get('archive/:id')
    findArchived(@Param('id', ParseUUIDPipe) id: string) {
      return this.service.findOne(id, true);
    }

    @Get('repair/:id')
    restore(@Param('id', ParseUUIDPipe) id: string) {
      return this.service.restore(id);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.service.findOne(id);
    }

    @Post()
    create(@Body(validate(dtos.create)) dto: object) {
      return this.service.create(dto as DeepPartial<T>);
    }

    @Put(':id')
    update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body(validate(dtos.update)) dto: object,
    ) {
      return this.service.update(id, dto as DeepPartial<T>);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.service.remove(id);
    }
  }
  return CrudControllerBase;
}
