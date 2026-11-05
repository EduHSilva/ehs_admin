<script setup lang="ts">
import { onMounted } from 'vue'
import { useDarkModeStore } from '~/src/stores/darkMode'

const darkModeStore = useDarkModeStore()

onMounted(() => darkModeStore.init())

useHead({
  titleTemplate: (title) => (title ? `${title} — EHS Admin` : 'EHS Admin'),
})
</script>

<template>
  <NuxtPage />
</template>
