import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiSquareEditOutline,
  mdiTable,
  mdiTelevisionGuide,
  mdiAccountGroupOutline,
  mdiLogout, mdiServer, mdiSitemap, mdiIntegratedCircuitChip,
} from '@mdi/js'

export const menuAsideMain = [
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    to: '/clientes',
    label: 'Clientes',
    icon: mdiAccountGroupOutline
  },
  {
    to: '/tables',
    label: 'Tables',
    icon: mdiTable,
  },
  {
    to: '/forms',
    label: 'Forms',
    icon: mdiSquareEditOutline,
  },
  {
    to: '/ui',
    label: 'UI',
    icon: mdiTelevisionGuide,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle,
  },
  {
    label: 'Sites',
    icon: mdiSitemap,
    menu: [
      {
        label: 'Finances',
        href: 'http://localhost:3000',
        target: '_blank',
      },
      {
        label: 'Fitness',
        href: 'http://localhost:3001',
        target: '_blank',
      },
    ],
  },
  {
    label: 'Integrações',
    icon: mdiIntegratedCircuitChip,
    menu: [
      {
        label: 'Spring Admin',
        href: 'http://localhost/admin',
        target: '_blank',
      },
      {
        label: 'Rabbit MQ',
        href: 'http://localhost:15672/',
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
        href: 'http://localhost/admin',
        target: '_blank',
      },
      {
        label: 'Rabbit MQ',
        href: 'http://localhost:15672/',
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
