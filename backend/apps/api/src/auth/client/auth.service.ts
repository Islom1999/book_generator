import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthProvider, User, UserIdentity } from '@app/entities';
import { OAuth2Client } from 'google-auth-library';
import { DataSource, Repository } from 'typeorm';
import type { GoogleLoginDto, TelegramLoginDto } from './auth.dto.js';
import type { UserJwtPayload } from '../../common/index.js';
import { verifyTelegramLogin } from './telegram-login.js';

interface ExternalProfile {
  provider: AuthProvider;
  providerUserId: string;
  fullName: string;
  email?: string | null;
  avatarUrl?: string | null;
  raw: Record<string, unknown>;
}

@Injectable()
export class AuthService {
  private readonly google = new OAuth2Client();

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async loginWithTelegram(dto: TelegramLoginDto) {
    const botToken = this.config.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    if (!verifyTelegramLogin({ ...dto }, botToken)) {
      throw new UnauthorizedException('Invalid Telegram login');
    }
    return this.login({
      provider: AuthProvider.TELEGRAM,
      providerUserId: String(dto.id),
      fullName: [dto.first_name, dto.last_name].filter(Boolean).join(' '),
      avatarUrl: dto.photo_url,
      raw: { ...dto, hash: undefined },
    });
  }

  async loginWithGoogle(dto: GoogleLoginDto) {
    const ticket = await this.google
      .verifyIdToken({
        idToken: dto.idToken,
        audience: this.config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      })
      .catch(() => {
        throw new UnauthorizedException('Invalid Google token');
      });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email_verified) {
      throw new UnauthorizedException('Invalid Google token');
    }
    return this.login({
      provider: AuthProvider.GOOGLE,
      providerUserId: profile.sub,
      fullName: profile.name ?? profile.email ?? 'User',
      email: profile.email,
      avatarUrl: profile.picture,
      raw: { ...profile },
    });
  }

  /** Finds the user linked to this provider account, creating both on first login. */
  private async login(profile: ExternalProfile) {
    const user = await this.dataSource.transaction(async (manager) => {
      const identity = await manager.findOne(UserIdentity, {
        where: {
          provider: profile.provider,
          provider_user_id: profile.providerUserId,
        },
        relations: { user: true },
      });
      if (identity) {
        identity.profile = profile.raw;
        await manager.save(identity);
        return identity.user;
      }
      const created = await manager.save(
        manager.create(User, {
          full_name: profile.fullName,
          email: profile.email ?? null,
          avatar_url: profile.avatarUrl ?? null,
        }),
      );
      await manager.save(
        manager.create(UserIdentity, {
          provider: profile.provider,
          provider_user_id: profile.providerUserId,
          user_id: created.id,
          profile: profile.raw,
        }),
      );
      return created;
    });

    if (user.is_blocked) {
      throw new UnauthorizedException('Account is blocked');
    }
    await this.users.update(user.id, { last_login_at: new Date() });

    const payload: UserJwtPayload = { sub: user.id, kind: 'user' };
    return {
      accessToken: await this.jwt.signAsync(payload, {
        expiresIn: this.config.get('USER_JWT_EXPIRES_IN', '30d'),
      }),
      user: await this.users.findOneByOrFail({ id: user.id }),
    };
  }
}
