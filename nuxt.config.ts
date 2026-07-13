import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-13',
  devtools: { enabled: true },
  ssr: false,
  app: {
    baseURL: '/admin/',
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
    public: { usersApiUrl: 'http://localhost/users' },
  },
})
