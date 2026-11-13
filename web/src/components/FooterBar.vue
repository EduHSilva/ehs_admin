<script setup>
import { containerMaxW } from '../config'
import BaseLevel from '../components/BaseLevel.vue'
import EhsBrand from '../components/EhsBrand.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="px-6 py-2" :class="containerMaxW">
    <BaseLevel>
      <div class="flex flex-col items-center justify-center gap-6 lg:flex-row lg:justify-start">
        <b>&copy;{{ year }}, EHS Solutions</b>
        <a href="/app/privacidade/" class="text-blue-600 hover:underline dark:text-blue-400">Política de Privacidade</a>
        <slot />
      </div>
      <div class="md:py-2">
        <EhsBrand />
      </div>
    </BaseLevel>
  </footer>
</template>
