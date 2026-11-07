<script setup>
defineProps({
  zIndex: {
    type: String,
    default: 'z-50',
  },
  type: {
    type: String,
    default: 'flex',
  },
})

const emit = defineEmits(['overlay-click'])

const overlayClick = (event) => {
  emit('overlay-click', event)
}
</script>

<template>
  <div
    :class="[type, zIndex]"
    class="fixed inset-0 flex-col items-center justify-center overflow-hidden"
  >
    <div
      class="overlay absolute inset-0 animate-overlay-fade-in bg-linear-to-tr opacity-90 dark:from-zinc-700 dark:via-zinc-900 dark:to-zinc-700"
      @click="overlayClick"
    />

    <slot />
  </div>
</template>
