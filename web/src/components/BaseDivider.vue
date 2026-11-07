<script setup>
const props = defineProps({
  navBar: Boolean,
})
</script>

<template>
  <hr
    :class="
      props.navBar
        ? 'hidden lg:my-0.5 lg:block dark:border-zinc-700'
        : '-mx-6 my-6 dark:border-zinc-800'
    "
    class="border-t border-zinc-100"
  />
</template>
