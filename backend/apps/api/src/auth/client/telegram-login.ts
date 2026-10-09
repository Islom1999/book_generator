import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export interface TelegramLoginData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const MAX_AGE_SECONDS = 24 * 60 * 60;

/**
 * Verifies data from the Telegram Login Widget.
 * https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyTelegramLogin(
  data: TelegramLoginData,
  botToken: string,
  now = Date.now(),
): boolean {
  const { hash, ...fields } = data;
  const checkString = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');
  const secret = createHash('sha256').update(botToken).digest();
  const expected = createHmac('sha256', secret).update(checkString).digest();
  const received = Buffer.from(hash, 'hex');
  const fresh = now / 1000 - data.auth_date < MAX_AGE_SECONDS;
  return (
    fresh &&
    received.length === expected.length &&
    timingSafeEqual(received, expected)
  );
}
