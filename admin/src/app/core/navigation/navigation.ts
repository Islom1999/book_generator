import { FuseNavigationItem } from '@fuse/components/navigation'

/**
 * Admin menu. Titles are translation keys; `NavigationService` translates
 * them for the active language.
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
      },
      {
        id: 'users.admins',
        title: 'nav.admins',
        type: 'basic',
        icon: 'heroicons_outline:shield-check',
        link: '/users/admins',
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
      },
      {
        id: 'reference.districts',
        title: 'nav.districts',
        type: 'basic',
        icon: 'heroicons_outline:map-pin',
        link: '/reference/districts',
      },
      {
        id: 'reference.post-offices',
        title: 'nav.postOffices',
        type: 'basic',
        icon: 'heroicons_outline:building-office',
        link: '/reference/post-offices',
      },
      {
        id: 'reference.languages',
        title: 'nav.languages',
        type: 'basic',
        icon: 'heroicons_outline:language',
        link: '/reference/languages',
      },
      {
        id: 'reference.settings',
        title: 'nav.settings',
        type: 'basic',
        icon: 'heroicons_outline:cog-6-tooth',
        link: '/reference/settings',
      },
    ],
  },
]
