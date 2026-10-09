import { createHash, createHmac } from 'node:crypto';
import {
  verifyTelegramLogin,
  type TelegramLoginData,
} from './telegram-login.js';

const BOT_TOKEN = '123456:test-token';

function signed(fields: Omit<TelegramLoginData, 'hash'>): TelegramLoginData {
  const checkString = Object.entries(fields)
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n');
  const secret = createHash('sha256').update(BOT_TOKEN).digest();
  const hash = createHmac('sha256', secret).update(checkString).digest('hex');
  return { ...fields, hash };
}

describe('verifyTelegramLogin', () => {
  const now = Date.UTC(2026, 9, 9);
  const fields = {
    id: 42,
    first_name: 'Ali',
    username: 'ali',
    auth_date: now / 1000 - 60,
  };

  it('accepts correctly signed data', () => {
    expect(verifyTelegramLogin(signed(fields), BOT_TOKEN, now)).toBe(true);
  });

  it('rejects tampered data', () => {
    expect(
      verifyTelegramLogin({ ...signed(fields), id: 43 }, BOT_TOKEN, now),
    ).toBe(false);
  });

  it('rejects data signed with another bot token', () => {
    expect(verifyTelegramLogin(signed(fields), '999:other', now)).toBe(false);
  });

  it('rejects stale logins', () => {
    const stale = signed({ ...fields, auth_date: now / 1000 - 2 * 24 * 3600 });
    expect(verifyTelegramLogin(stale, BOT_TOKEN, now)).toBe(false);
  });
});
