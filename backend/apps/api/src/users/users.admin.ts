import {
  Body,
  Controller,
  Get,
  HttpCode,
  Injectable,
  Module,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { AdminAuth, BaseCrudService, TableQueryDto } from '@app/common';
import { AdminRole, User } from '@app/database';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import type { Repository } from 'typeorm';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @Length(2, 255)
  full_name?: string;

  @IsOptional()
  @IsBoolean()
  is_blocked?: boolean;
}

@Injectable()
export class CustomersService extends BaseCrudService<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo, {
      searchFields: ['full_name', 'phone', 'email'],
      relations: ['identities'],
    });
  }
}

/** Customers are created by signing in; admins can only view, edit and block them. */
@Controller('admin/users')
@AdminAuth(AdminRole.OPERATOR, AdminRole.FINANCE)
export class CustomersAdminController {
  constructor(private readonly service: CustomersService) {}

  @Post('pagination')
  @HttpCode(200)
  paginate(@Body() query: TableQueryDto) {
    return this.service.paginate(query);
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

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [CustomersAdminController],
  providers: [CustomersService],
})
export class CustomersAdminModule {}
