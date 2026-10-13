import { FuseNavigationItem } from '@fuse/components/navigation'

/**
 * Admin menu. Titles are translation keys; `NavigationService` translates
 * them for the active language and hides items whose `meta.permissions`
 * (any of) the admin lacks. Groups left empty are hidden too.
 */
export const adminNavigation: FuseNavigationItem[] = [
  {
    id: 'dashboard',
    title: 'nav.dashboard',
    type: 'basic',
    icon: 'heroicons_outline:chart-pie',
    link: '/dashboard',
  },
  {
    id: 'users',
    title: 'nav.users',
    type: 'group',
    children: [
      {
        id: 'users.customers',
        title: 'nav.customers',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/users/customers',
        meta: { permissions: ['customers.view'] },
      },
      {
        id: 'users.admins',
        title: 'nav.admins',
        type: 'basic',
        icon: 'heroicons_outline:shield-check',
        link: '/users/admins',
        meta: { permissions: ['admins.view', 'admins.manage'] },
      },
      {
        id: 'users.roles',
        title: 'nav.roles',
        type: 'basic',
        icon: 'heroicons_outline:key',
        link: '/users/roles',
        meta: { permissions: ['roles.manage', 'admins.view', 'admins.manage'] },
      },
    ],
  },
  {
    id: 'reference',
    title: 'nav.reference',
    type: 'group',
    children: [
      {
        id: 'reference.regions',
        title: 'nav.regions',
        type: 'basic',
        icon: 'heroicons_outline:map',
        link: '/reference/regions',
        meta: { permissions: ['addresses.manage'] },
      },
      {
        id: 'reference.districts',
        title: 'nav.districts',
        type: 'basic',
        icon: 'heroicons_outline:map-pin',
        link: '/reference/districts',
        meta: { permissions: ['addresses.manage'] },
      },
      {
        id: 'reference.post-offices',
        title: 'nav.postOffices',
        type: 'basic',
        icon: 'heroicons_outline:building-office',
        link: '/reference/post-offices',
        meta: { permissions: ['addresses.manage'] },
      },
      {
        id: 'reference.languages',
        title: 'nav.languages',
        type: 'basic',
        icon: 'heroicons_outline:language',
        link: '/reference/languages',
        meta: { permissions: ['languages.manage'] },
      },
      {
        id: 'reference.settings',
        title: 'nav.settings',
        type: 'basic',
        icon: 'heroicons_outline:cog-6-tooth',
        link: '/reference/settings',
        meta: { permissions: ['settings.manage'] },
      },
    ],
  },
  {
    id: 'system',
    title: 'nav.system',
    type: 'group',
    children: [
      {
        id: 'system.audit',
        title: 'nav.audit',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-list',
        link: '/system/audit',
        meta: { permissions: ['audit.view'] },
      },
    ],
  },
]
