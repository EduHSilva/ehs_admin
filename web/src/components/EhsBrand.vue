<script setup>
import { mdiTuneVariant } from '@mdi/js'
import BaseIcon from './BaseIcon.vue'

defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <span class="inline-flex items-center gap-2 font-semibold">
    <span
      class="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm"
      aria-hidden="true"
    >
      <BaseIcon :path="mdiTuneVariant" size="18" />
    </span>
    <span v-if="!compact" class="text-base tracking-tight">EHS <b class="font-black">Admin</b></span>
  </span>
</template>
