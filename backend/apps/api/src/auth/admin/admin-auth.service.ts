import {
  Injectable,
  Logger,
  type OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRole, AdminUser } from '@app/entities';
import type { AdminJwtPayload } from '../../common/index.js';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

@Injectable()
export class AdminAuthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    @InjectRepository(AdminUser) private readonly admins: Repository<AdminUser>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /** Creates the first super admin from ADMIN_EMAIL / ADMIN_PASSWORD on an empty install. */
  async onApplicationBootstrap() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (
      !email ||
      !password ||
      (await this.admins.count({ withDeleted: true })) > 0
    ) {
      return;
    }
    await this.admins.save(
      this.admins.create({
        email: email.toLowerCase(),
        password_hash: await bcrypt.hash(password, 12),
        full_name: 'Super Admin',
        role: AdminRole.SUPER_ADMIN,
      }),
    );
    this.logger.log(`Created first super admin ${email}`);
  }

  async signIn(email: string, password: string) {
    const admin = await this.admins.findOne({
      where: { email: email.toLowerCase(), is_active: true },
      select: { id: true, password_hash: true },
    });
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    await this.admins.update(admin.id, { last_login_at: new Date() });
    return this.session(admin.id);
  }

  /** Fuse calls this on reload: re-validates the admin and rotates the token. */
  async signInWithToken(token: string) {
    let payload: AdminJwtPayload;
    try {
      payload = await this.jwt.verifyAsync<AdminJwtPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }
    if (payload.kind !== 'admin') {
      throw new UnauthorizedException();
    }
    return this.session(payload.sub);
  }

  private async session(adminId: string) {
    const admin = await this.admins.findOneBy({ id: adminId, is_active: true });
    if (!admin) {
      throw new UnauthorizedException();
    }
    const payload: AdminJwtPayload = {
      sub: admin.id,
      kind: 'admin',
      role: admin.role,
    };
    return {
      accessToken: await this.jwt.signAsync(payload, {
        expiresIn: this.config.get('ADMIN_JWT_EXPIRES_IN', '12h'),
      }),
      user: {
        id: admin.id,
        name: admin.full_name,
        email: admin.email,
        role: admin.role,
        status: 'online',
      },
    };
  }
}
