/**
 * Permission keys, mirroring the API catalog
 * (`backend/apps/api/src/core/permission/permission.catalog.ts`). Used only to
 * show or hide menus and buttons; the API checks every request itself.
 * Labels: `permissions.<key>` and `permissionGroups.<group>` in i18n.
 */
export type Permission =
  | 'admins.view'
  | 'admins.manage'
  | 'roles.manage'
  | 'languages.manage'
  | 'settings.manage'
  | 'addresses.manage'
  | 'customers.view'
  | 'customers.edit'
  | 'customers.block'
  | 'customers.grant_trial'
  | 'templates.view'
  | 'templates.manage'
  | 'formats.manage'
  | 'orders.view'
  | 'orders.cancel'
  | 'orders.hold'
  | 'moderation.review'
  | 'moderation.regenerate'
  | 'moderation.edit_text'
  | 'print.manage'
  | 'print.download'
  | 'shipping.manage'
  | 'wallet.view'
  | 'wallet.adjust'
  | 'wallet.withdraw'
  | 'payments.view'
  | 'reports.finance'
  | 'dashboard.view'
  | 'audit.view'

/** One group of the catalog as returned by `GET admin/permissions`. */
export interface IPermissionGroup {
  group: string
  permissions: Permission[]
}
