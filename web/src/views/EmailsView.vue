<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  mdiAccountMultiple,
  mdiAlertCircleOutline,
  mdiEmailAlertOutline,
  mdiEmailCheckOutline,
  mdiEmailOutline,
  mdiRefresh,
} from '@mdi/js'
import SectionMain from '../components/SectionMain.vue'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton.vue'
import LayoutAuthenticated from '../layouts/LayoutAuthenticated.vue'
import CardBox from '../components/CardBox.vue'
import CardBoxWidget from '../components/CardBoxWidget.vue'
import NotificationBar from '../components/NotificationBar.vue'
import BaseButton from '../components/BaseButton.vue'
import { clientsStore } from '../stores/clientsStore'

const store = clientsStore()
const refreshing = ref(false)

async function load() {
  refreshing.value = true
  await store.fetchEmailStats()
  refreshing.value = false
}

let timer
onMounted(() => {
  load()
  timer = setInterval(load, 10000)
})
onUnmounted(() => clearInterval(timer))

const stats = computed(() => store.emailStats)

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('pt-BR')
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiEmailOutline" title="E-mails" main>
        <BaseButton
          :icon="mdiRefresh"
          color="whiteDark"
          small
          :disabled="refreshing"
          @click="load"
        />
      </SectionTitleLineWithButton>

      <NotificationBar v-if="store.error" color="danger" :icon="mdiAlertCircleOutline">
        {{ store.error }}
      </NotificationBar>

      <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CardBoxWidget
          color="text-indigo-500"
          :icon="mdiEmailOutline"
          :number="stats?.readyMessages ?? 0"
          label="Na fila"
        />
        <CardBoxWidget
          color="text-zinc-500"
          :icon="mdiAccountMultiple"
          :number="stats?.consumers ?? 0"
          label="Consumidores"
        />
        <CardBoxWidget
          color="text-emerald-500"
          :icon="mdiEmailCheckOutline"
          :number="stats?.sent ?? 0"
          label="Enviados"
        />
        <CardBoxWidget
          color="text-red-500"
          :icon="mdiEmailAlertOutline"
          :number="stats?.errors ?? 0"
          label="Erros"
        />
      </div>

      <CardBox>
        <h3 class="mb-4 text-lg font-semibold">Fila de e-mails</h3>
        <dl class="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-zinc-500 dark:text-zinc-400">Fila</dt>
            <dd class="font-medium">{{ stats?.queue ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-zinc-500 dark:text-zinc-400">Última atualização</dt>
            <dd class="font-medium">{{ refreshing ? 'Atualizando...' : 'Automática a cada 10 segundos' }}</dd>
          </div>
          <div>
            <dt class="text-zinc-500 dark:text-zinc-400">Último erro em</dt>
            <dd class="font-medium">{{ formatDateTime(stats?.lastErrorAt) }}</dd>
          </div>
          <div>
            <dt class="text-zinc-500 dark:text-zinc-400">Destinatário do último erro</dt>
            <dd class="font-medium">{{ stats?.lastErrorTo || '—' }}</dd>
          </div>
        </dl>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
