<script setup>
import { computed } from 'vue'
import { mdiAlertCircleOutline, mdiCheckDecagram, mdiClockOutline } from '@mdi/js'
import BaseLevel from '../components/BaseLevel.vue'
import UserAvatar from '../components/UserAvatar.vue'
import CardBox from '../components/CardBox.vue'
import PillTag from '../components/PillTag.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  lastLogin: {
    type: [String, Number],
    default: null,
  },
})

const STATUS = {
  OK: { label: 'Ativo', color: 'success', icon: mdiCheckDecagram },
  WAITING_CONFIRMATION: { label: 'Aguardando confirmação', color: 'warning', icon: mdiClockOutline },
  BLOCKED: { label: 'Bloqueado', color: 'danger', icon: mdiAlertCircleOutline },
  DELETED: { label: 'Excluído', color: 'danger', icon: mdiAlertCircleOutline },
}

const status = computed(
  () => STATUS[props.user.status] ?? { label: props.user.status ?? '—', color: 'info' },
)

const roles = computed(() => props.user.roles ?? [])

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('pt-BR')
}
</script>

<template>
  <CardBox>
    <BaseLevel type="justify-around lg:justify-center">
      <UserAvatar :username="user.username" class="w-24 shrink-0 lg:mx-12" />
      <div class="space-y-3 text-center md:text-left lg:mx-12">
        <h1 class="text-2xl">
          <b>{{ user.username }}</b>
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400">{{ user.email }}</p>
        <div class="flex flex-wrap justify-center gap-2 md:justify-start">
          <PillTag :label="status.label" :color="status.color" :icon="status.icon" />
          <PillTag v-for="role in roles" :key="role" :label="role" color="info" outline />
        </div>
        <div class="space-y-1 text-sm">
          <p>
            Empresa: <b>{{ user.companyName || 'Sem empresa' }}</b>
          </p>
          <p>
            Criado em: <b>{{ formatDate(user.createdDate) }}</b>
          </p>
          <p>
            Último login: <b>{{ formatDate(lastLogin) }}</b>
          </p>
        </div>
      </div>
    </BaseLevel>
  </CardBox>
</template>
