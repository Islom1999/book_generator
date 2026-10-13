/**
 * Every permission key the API checks (BUSINESS_LOGIC §9). Roles are created
 * in the admin panel from these keys; the admin panel shows them grouped and
 * translates `permissions.<key>`. Add a key here when a feature needs one and
 * document it in BUSINESS_LOGIC §9.
 */
export const PERMISSION_GROUPS = {
  admins: ['admins.view', 'admins.manage', 'roles.manage'],
  references: ['languages.manage', 'settings.manage', 'addresses.manage'],
  customers: [
    'customers.view',
    'customers.edit',
    'customers.block',
    'customers.grant_trial',
  ],
  catalog: ['templates.view', 'templates.manage', 'formats.manage'],
  orders: ['orders.view', 'orders.cancel', 'orders.hold'],
  moderation: [
    'moderation.review',
    'moderation.regenerate',
    'moderation.edit_text',
  ],
  print: ['print.manage', 'print.download', 'shipping.manage'],
  finance: [
    'wallet.view',
    'wallet.adjust',
    'wallet.withdraw',
    'payments.view',
    'reports.finance',
  ],
  other: ['dashboard.view', 'audit.view'],
} as const;

export type Permission =
  (typeof PERMISSION_GROUPS)[keyof typeof PERMISSION_GROUPS][number];

export const PERMISSIONS: readonly Permission[] =
  Object.values(PERMISSION_GROUPS).flat();
