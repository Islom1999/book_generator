import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAuth } from '../../../common/index.js';
import { PrimeTableQuerySwaggerDTO } from '../../../core/base/base.interface.js';
import { AuditLogsService } from './audit-logs.service.js';

@ApiTags('admin / audit-logs')
@ApiBearerAuth()
@Controller('admin/audit-logs')
@AdminAuth('audit.view')
export class AuditLogsController {
  constructor(private readonly service: AuditLogsService) {}

  @Post('pagination')
  @HttpCode(200)
  findAllPaginationPost(@Body() query: PrimeTableQuerySwaggerDTO) {
    return this.service.findAllPaginationPost(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}
