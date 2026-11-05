<script setup>
import AsideMenuLayer from '../components/AsideMenuLayer.vue'

defineProps({
  menu: {
    type: Array,
    required: true,
  },
  menuBottom: Array,
  isAsideMobileExpanded: Boolean,
  isAsideLgActive: Boolean,
})

const emit = defineEmits(['menu-click', 'aside-lg-close-click'])

const menuClick = (event, item) => {
  emit('menu-click', event, item)
}

const asideLgCloseClick = (event) => {
  emit('aside-lg-close-click', event)
}
</script>

<template>
  <AsideMenuLayer
    :menu="menu"
    :menu-bottom="menuBottom"
    :class="[
      isAsideMobileExpanded ? 'left-0' : '-left-60',
      isAsideLgActive ? 'lg:left-0' : 'lg:-left-60',
    ]"
    @menu-click="menuClick"
    @aside-lg-close-click="asideLgCloseClick"
  />
</template>
