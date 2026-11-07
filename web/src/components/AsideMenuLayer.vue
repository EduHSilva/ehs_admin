<script setup>
import { mdiClose } from '@mdi/js'
import AsideMenuList from '../components/AsideMenuList.vue'
import BaseIcon from '../components/BaseIcon.vue'
import EhsBrand from '../components/EhsBrand.vue'

defineProps({
  menu: {
    type: Array,
    required: true,
  },
  menuBottom: Array,
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
  <aside
    id="aside"
    class="fixed inset-y-0 z-40 flex w-60 overflow-hidden border-r border-zinc-700/80 transition-(--transition-position)"
  >
    <div class="aside flex flex-1 flex-col overflow-hidden dark:bg-zinc-900">
      <div class="aside-brand flex h-14 flex-row items-center justify-between dark:bg-zinc-900">
        <div class="flex flex-1 justify-center lg:pl-6 lg:justify-start xl:pl-0">
          <EhsBrand />
        </div>
        <button class="hidden p-3 lg:inline-block xl:hidden" @click.prevent="asideLgCloseClick">
          <BaseIcon :path="mdiClose" />
        </button>
      </div>
      <div
        class="aside-scrollbar flex-1 overflow-x-hidden overflow-y-auto dark:scrollbar-styled-dark"
      >
        <AsideMenuList :menu="menu" @menu-click="menuClick" />
      </div>

      <AsideMenuList v-if="menuBottom" :menu="menuBottom" @menu-click="menuClick" />
    </div>
  </aside>
</template>
