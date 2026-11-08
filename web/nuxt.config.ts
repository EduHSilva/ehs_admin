import tailwindcss from '@tailwindcss/vite'

// Definido em build-time no Dockerfile/CI. O nginx dos microservices publica
// este app em /app/admin/ e encaminha /users para o gateway. Em dev, acesse
// http://localhost:3000/app/admin/ (ou sobrescreva NUXT_APP_BASE_URL).
const appBaseURL = process.env.NUXT_APP_BASE_URL || '/app/admin/'
const usersApiUrl = process.env.NUXT_PUBLIC_USERS_API_URL || 'http://localhost/users'
const notificationsApiUrl =
  process.env.NUXT_PUBLIC_NOTIFICATIONS_API_URL || 'http://localhost/notifications'

// Em dev o nginx dos microservices publica os sites e o Spring Admin na porta 80.
// Sem isso, links como /app/study/ caem no fallback do Nuxt e viram /app/admin/app/study/.
const devProxyTarget = process.env.NUXT_DEV_PROXY_TARGET || 'http://localhost'
const devProxy = Object.fromEntries(
  ['/app/study', '/app/budgets', '/app/finances', '/app/fitness', '/app/portfolio', '/admin', '/rabbitmq'].map(
    (path) => [path, { target: devProxyTarget, changeOrigin: true, ws: true }],
  ),
)

export default defineNuxtConfig({
  compatibilityDate: '2026-07-13',
  devtools: { enabled: true },
  ssr: false,
  app: {
    baseURL: appBaseURL,
  },
  modules: ['@pinia/nuxt'],
  css: ['~/src/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: devProxy,
    },
  },
  components: [{ path: '~/src/components', pathPrefix: false }],
  imports: { dirs: ['src/stores', 'src/services'] },
  alias: { '@': './src' },
  runtimeConfig: {
    public: { usersApiUrl, notificationsApiUrl },
  },
})
