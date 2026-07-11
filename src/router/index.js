import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import { isAuthenticated, verifySession } from '@/services/auth.js'

const routes = [
  {
    path: '/',
    redirect: () => (isAuthenticated() ? '/dashboard' : '/login'),
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    path: '/dashboard',
    name: 'dashboard',
    component: Home,
    meta: { title: 'Dashboard', requiresAuth: true },
  },
  {
    meta: { title: 'Usu[arios', requiresAuth: true },
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue'),
  },
  {
    meta: { title: 'Tables', requiresAuth: true },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue'),
  },
  {
    meta: { title: 'Forms', requiresAuth: true },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue'),
  },
  {
    meta: { title: 'Profile', requiresAuth: true },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
  },
  {
    meta: { title: 'Ui', requiresAuth: true },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login', guestOnly: true },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const user = await verifySession()

    if (!user) {
      return { name: 'login' }
    }
  }

  if (to.meta.guestOnly && isAuthenticated()) {
    const user = await verifySession()

    if (user) {
      return { name: 'dashboard' }
    }
  }
})

export default router
