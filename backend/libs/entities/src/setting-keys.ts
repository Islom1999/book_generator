import type { EntityManager } from 'typeorm';
import { Setting } from './setting.entity.js';

/**
 * Every runtime setting (BUSINESS_LOGIC §15) with the value used when the row
 * is missing. Admins change the values in the panel; code never hard-codes them.
 * Shared by the API and the worker.
 */
export const SETTING_DEFAULTS = {
  'trial.max_books': 3,
  'trial.max_pages': 3,
  'trial.max_regenerations': 1,
  'trial.expires_days': 30,
  'ai.daily_budget_usd': 50,
  'photos.retention_days': 30,
  'children.max_per_user': 5,
  'order.customer_review_enabled': true,
  'order.customer_review_hours': 48,
  'order.max_customer_revisions': 1,
  'moderation.max_regenerations_per_page': 3,
  'preview.max_px': 800,
  'preview.watermark_text': 'ertaklar.uz',
  'preview.url_ttl_seconds': 900,
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type SettingValue<K extends SettingKey> =
  (typeof SETTING_DEFAULTS)[K] extends number
    ? number
    : (typeof SETTING_DEFAULTS)[K] extends boolean
      ? boolean
      : string;

/** Current value of a setting, falling back to its default. */
export async function readSetting<K extends SettingKey>(
  manager: EntityManager,
  key: K,
): Promise<SettingValue<K>> {
  const row = await manager.findOneBy(Setting, { key });
  return (row?.value ?? SETTING_DEFAULTS[key]) as SettingValue<K>;
}
