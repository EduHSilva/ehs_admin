<script setup>
import { mdiClose } from '@mdi/js'
import AsideMenuList from '../components/AsideMenuList.vue'
import BaseIcon from '../components/BaseIcon.vue'

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
    class="fixed inset-y-0 z-40 flex w-60 overflow-hidden border-r border-slate-700/80 transition-(--transition-position)"
  >
    <div class="aside flex flex-1 flex-col overflow-hidden dark:bg-slate-900">
      <div class="aside-brand flex h-14 flex-row items-center justify-between dark:bg-slate-900">
        <div class="flex-1 text-center lg:pl-6 lg:text-left xl:pl-0 xl:text-center">
          <b class="font-black">Admin</b>
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
