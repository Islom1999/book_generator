import {
  Injectable,
  Logger,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, InlineKeyboard } from 'grammy';

/**
 * Telegram bot. Phase 0: greets users and links to the storefront.
 * Next: deep-link login (`/start login_<token>`), phone sharing for the
 * free-trial limit, and order status notifications.
 */
@Injectable()
export class BotService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(BotService.name);
  private bot?: Bot;

  constructor(private readonly config: ConfigService) {}

  onApplicationBootstrap() {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN is not set; bot is disabled');
      return;
    }
    const siteUrl = this.config.get<string>(
      'CLIENT_URL',
      'https://ertaklar.uz',
    );

    this.bot = new Bot(token);
    this.bot.command('start', (ctx) =>
      ctx.reply(
        "Assalomu alaykum! Ertaklar.uz — farzandingiz bosh qahramon bo'lgan ertak kitoblari.",
        { reply_markup: new InlineKeyboard().url('Saytga o‘tish', siteUrl) },
      ),
    );
    this.bot.catch((error) => this.logger.error(error.message, error.stack));
    void this.bot.start({
      onStart: (me) => this.logger.log(`Bot @${me.username} started`),
    });
  }

  async onApplicationShutdown() {
    await this.bot?.stop();
  }
}
