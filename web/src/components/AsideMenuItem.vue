<script setup>
import { ref, computed } from 'vue'
import { mdiMinus, mdiPlus } from '@mdi/js'
import { getButtonColor } from '../colors'
import BaseIcon from '../components/BaseIcon.vue'
import AsideMenuList from '../components/AsideMenuList.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isDropdownList: Boolean,
})

const emit = defineEmits(['menu-click'])

const route = useRoute()

const hasColor = computed(() => props.item && props.item.color)

const isItemActive = computed(
  () =>
    typeof props.item.to === 'string' &&
    (route.path === props.item.to || route.path.endsWith(props.item.to)),
)

const isDropdownActive = ref(false)

const componentClass = computed(() => [
  props.isDropdownList ? 'py-3 px-6 text-sm' : 'py-3',
  hasColor.value
    ? getButtonColor(props.item.color, false, true)
    : `aside-menu-item dark:text-zinc-300 dark:hover:text-white`,
])

const hasDropdown = computed(() => !!props.item.menu)

const menuClick = (event) => {
  emit('menu-click', event, props.item)

  if (hasDropdown.value) {
    isDropdownActive.value = !isDropdownActive.value
  }
}
</script>

<template>
  <li>
    <NuxtLink
      v-if="item.to"
      :to="item.to ?? null"
      class="flex cursor-pointer"
      :class="[
        componentClass,
        isItemActive && !hasColor
          ? 'aside-menu-item-active border-l-2 border-indigo-400 bg-indigo-500/15 font-semibold text-white'
          : '',
      ]"
      @click="menuClick"
    >
      <BaseIcon v-if="item.icon" :path="item.icon" class="flex-none" w="w-16" :size="18" />
      <span
        class="line-clamp-1 grow text-ellipsis"
        :class="{ 'pr-6': !hasDropdown }"
        >{{ item.label }}</span
      >
      <BaseIcon
        v-if="hasDropdown"
        :path="isDropdownActive ? mdiMinus : mdiPlus"
        class="flex-none"
        w="w-12"
      />
    </NuxtLink>
    <a
      v-else
      :href="item.href ?? null"
      :target="item.target ?? null"
      class="flex cursor-pointer"
      :class="[
        componentClass,
        isItemActive && !hasColor
          ? 'aside-menu-item-active border-l-2 border-indigo-400 bg-indigo-500/15 font-semibold text-white'
          : '',
      ]"
      @click="menuClick"
    >
      <BaseIcon v-if="item.icon" :path="item.icon" class="flex-none" w="w-16" :size="18" />
      <span
        class="line-clamp-1 grow text-ellipsis"
        :class="{ 'pr-6': !hasDropdown }"
        >{{ item.label }}</span
      >
      <BaseIcon
        v-if="hasDropdown"
        :path="isDropdownActive ? mdiMinus : mdiPlus"
        class="flex-none"
        w="w-12"
      />
    </a>
    <AsideMenuList
      v-if="hasDropdown"
      :menu="item.menu"
      :class="['aside-menu-dropdown', isDropdownActive ? 'block dark:bg-zinc-800/50' : 'hidden']"
      is-dropdown-list
    />
  </li>
</template>
