import { Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import type { CostumBaseEntity } from '@app/entities';
import type { BaseClientService } from './base.service.js';

/**
 * Storefront read endpoints:
 *
 * | Route     | Response                              |
 * | --------- | ------------------------------------- |
 * | `GET /`   | `{ data, total, page, limit }`        |
 * | `GET /:id`| one record                            |
 *
 * `GET /` takes `?page=1&limit=20&search=...` plus equality filters listed
 * in the service's `filterFields` (e.g. `?region_id=`).
 */
export abstract class BaseClientController<M extends CostumBaseEntity> {
  protected constructor(protected readonly service: BaseClientService<M>) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAllPagination(@Query() query: Record<string, unknown>) {
    return this.service.findAllPagination(this.service.parseQuery(query));
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}
