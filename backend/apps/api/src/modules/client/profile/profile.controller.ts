import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, UserAuth, type UserJwtPayload } from '../../../common/index.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ProfileService } from './profile.service.js';

@ApiTags('client / profile')
@ApiBearerAuth()
@Controller('me')
@UserAuth()
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @Get()
  me(@Auth() auth: UserJwtPayload) {
    return this.profile.me(auth.sub);
  }

  @Patch()
  update(@Auth() auth: UserJwtPayload, @Body() dto: UpdateProfileDto) {
    return this.profile.update(auth.sub, dto);
  }
}
