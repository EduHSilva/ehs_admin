import {
  mdiAccountCircle,
  mdiEmailOutline,
  mdiMonitor,
  mdiGithub,
  mdiAccountGroupOutline,
  mdiLogout,
  mdiServer,
  mdiSitemap,
} from '@mdi/js'

const origin = typeof window === 'undefined' ? '' : window.location.origin
const host = typeof window === 'undefined' ? '' : `${window.location.protocol}//${window.location.hostname}`

export const menuAsideMain = [
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    to: '/clientes',
    label: 'Clientes',
    icon: mdiAccountGroupOutline,
  },
  {
    to: '/emails',
    label: 'E-mails',
    icon: mdiEmailOutline,
  },
  {
    to: '/profile',
    label: 'Perfil',
    icon: mdiAccountCircle,
  },
  {
    label: 'Sites',
    icon: mdiSitemap,
    menu: [
      {
        label: 'Estudos',
        href: `${origin}/app/study/`,
        target: '_blank',
      },
      {
        label: 'CRM',
        href: `${origin}/app/crm/`,
        target: '_blank',
      },
      {
        label: 'Finanças',
        href: `${origin}/app/finances/`,
        target: '_blank',
      },
      {
        label: 'Fitness',
        href: `${origin}/app/fitness/`,
        target: '_blank',
      },
      {
        label: 'Portfólio',
        href: `${origin}/app/portfolio/`,
        target: '_blank',
      },
    ],
  },
  {
    label: 'Infra',
    icon: mdiServer,
    menu: [
      {
        label: 'Spring Admin',
        href: `${origin}/admin/`,
        target: '_blank',
      },
      {
        label: 'Rabbit MQ',
        href: `${host}:15672/`,
        target: '_blank',
      },
    ],
  },
  {
    href: 'https://github.com/EduHSilva',
    label: 'GitHub',
    icon: mdiGithub,
    target: '_blank',
  },
]

export const menuAsideBottom = [
  {
    label: 'Logout',
    icon: mdiLogout,
    color: 'info',
    isLogout: true,
  },
]
