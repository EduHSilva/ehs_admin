import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiSquareEditOutline,
  mdiTable,
  mdiTelevisionGuide,
  mdiAccountGroupOutline,
  mdiLogout, mdiServer,
} from '@mdi/js'

export const menuAsideMain = [
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    to: '/users',
    label: 'Usuários',
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
