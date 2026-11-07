<script setup lang="ts">
import { onMounted } from 'vue'
import { useDarkModeStore } from '~/src/stores/darkMode'

const darkModeStore = useDarkModeStore()
const appBase = useRuntimeConfig().app.baseURL

onMounted(() => darkModeStore.init())

const description = 'Painel administrativo da EHS Solutions: usuários, empresas, e-mails e integrações.'

useHead({
  titleTemplate: (title) => (title ? `${title} · EHS Admin` : 'EHS Admin — Painel da EHS Solutions'),
  meta: [
    { name: 'description', content: description },
    { name: 'theme-color', content: '#4F46E5' },
    { name: 'apple-mobile-web-app-title', content: 'EHS Admin' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: `${appBase}favicon.svg` },
    { rel: 'icon', href: `${appBase}favicon.ico`, sizes: '32x32' },
    { rel: 'apple-touch-icon', href: `${appBase}apple-touch-icon.png` },
  ],
  htmlAttrs: { lang: 'pt-BR' },
})

useSeoMeta({
  ogTitle: 'EHS Admin — Painel da EHS Solutions',
  ogDescription: description,
})
</script>

<template>
  <NuxtPage />
</template>
