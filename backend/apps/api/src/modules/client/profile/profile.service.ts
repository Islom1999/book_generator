import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/entities';
import type { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

/** The signed-in customer's own profile. */
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async me(userId: string) {
    const user = await this.users.findOneBy({ id: userId });
    if (!user || user.is_blocked) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async update(userId: string, dto: UpdateProfileDto) {
    await this.me(userId);
    await this.users.update(userId, dto);
    return this.me(userId);
  }
}
