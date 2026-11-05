import tailwindcss from '@tailwindcss/vite'

// Definido em build-time no Dockerfile/CI. O nginx dos microservices publica
// este app em /app/admin/ e encaminha /users para o gateway. Em dev, acesse
// http://localhost:3000/app/admin/ (ou sobrescreva NUXT_APP_BASE_URL).
const appBaseURL = process.env.NUXT_APP_BASE_URL || '/app/admin/'
const usersApiUrl = process.env.NUXT_PUBLIC_USERS_API_URL || 'http://localhost/users'

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
  },
  components: [{ path: '~/src/components', pathPrefix: false }],
  imports: { dirs: ['src/stores', 'src/services'] },
  alias: { '@': './src' },
  runtimeConfig: {
    public: { usersApiUrl },
  },
})
