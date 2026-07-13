<script setup>
import { computed } from 'vue'
import { useDarkModeStore } from '../stores/darkMode'
import {
  gradientBgPurplePink,
  gradientBgDark,
  gradientBgPinkRed,
  gradientBgSlateBlue,
} from '../colors'

const props = defineProps({
  bg: {
    type: String,
    required: true,
    validator: (value) => ['purplePink', 'pinkRed', 'slateBlue'].includes(value),
  },
})

const colorClass = computed(() => {
  if (useDarkModeStore().isEnabled) {
    return gradientBgDark
  }

  switch (props.bg) {
    case 'purplePink':
      return gradientBgPurplePink
    case 'pinkRed':
      return gradientBgPinkRed
    case 'slateBlue':
      return gradientBgSlateBlue
  }

  return ''
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center" :class="colorClass">
    <slot card-class="w-11/12 md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-xl" />
  </div>
</template>
