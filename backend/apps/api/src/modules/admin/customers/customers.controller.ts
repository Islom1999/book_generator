import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminRole } from '@app/entities';
import { AdminAuth } from '../../../common/index.js';
import { PrimeTableQuerySwaggerDTO } from '../../../core/base/base.interface.js';
import { CustomersService } from './customers.service.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';

/**
 * Customers are created by signing in, so this controller does not extend
 * `BaseAdminController`: admins can only list, view, edit and block them.
 */
@ApiTags('admin / customers')
@ApiBearerAuth()
@Controller('admin/users')
@AdminAuth(AdminRole.OPERATOR, AdminRole.FINANCE) // permission: customers.view, customers.edit
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Post('pagination')
  @HttpCode(200)
  findAllPaginationPost(@Body() query: PrimeTableQuerySwaggerDTO) {
    return this.service.findAllPaginationPost(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.service.update(id, dto);
  }
}
