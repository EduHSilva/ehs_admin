<script setup>
import { computed, ref } from 'vue'
import {
  mdiAccountCancelOutline,
  mdiAccountClockOutline,
  mdiAccountMultiple,
  mdiAccountOffOutline,
  mdiAlertCircleOutline,
  mdiBookOpenPageVariantOutline,
  mdiBriefcaseOutline,
  mdiCashMultiple,
  mdiDomain,
  mdiDumbbell,
  mdiRefresh,
  mdiSitemap,
} from '@mdi/js'
import SectionMain from '../components/SectionMain.vue'
import CardBox from '../components/CardBox.vue'
import CardBoxWidget from '../components/CardBoxWidget.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseIcon from '../components/BaseIcon.vue'
import NotificationBar from '../components/NotificationBar.vue'
import LineChart from '../components/Charts/LineChart.vue'
import LayoutAuthenticated from '../layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton.vue'
import { clientsStore } from '../stores/clientsStore'

const RANGE_OPTIONS = [
  { value: 7, label: '7 dias' },
  { value: 30, label: '30 dias' },
  { value: 90, label: '90 dias' },
]
const INTERVAL_OPTIONS = [
  { value: 'day', label: 'Diário' },
  { value: 'week', label: 'Semanal' },
  { value: 'month', label: 'Mensal' },
]

const store = clientsStore()
const origin = typeof window === 'undefined' ? '' : window.location.origin

const range = ref(30)
const interval = ref('day')
const statsLoading = ref(false)

const statusLabels = {
  OK: 'Ativo',
  WAITING_CONFIRMATION: 'Aguardando confirmação',
  BLOCKED: 'Bloqueado',
  DELETED: 'Excluído',
}

const toTime = (value) => {
  const time = value ? new Date(value).getTime() : 0
  return Number.isNaN(time) ? 0 : time
}

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('pt-BR') : '—')

function localIso(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function loadStats() {
  statsLoading.value = true

  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - (range.value - 1))

  await store.fetchStats({ from: localIso(from), to: localIso(to), interval: interval.value })
  statsLoading.value = false
}

function loadRecent() {
  return Promise.all([
    store.fetchUsers({ page: 0, size: 5, sort: 'createdDate', direction: 'desc' }),
    store.fetchCompanies({ page: 0, size: 5, sort: 'createdDate', direction: 'desc' }),
  ])
}

function reload() {
  return Promise.all([loadStats(), loadRecent()])
}

await reload()

const stats = computed(() => store.stats)
const totalUsers = computed(() => stats.value?.totalUsers ?? store.usersMeta.total)
const totalCompanies = computed(() => stats.value?.totalCompanies ?? store.companiesMeta.total)
const pendingUsers = computed(() => stats.value?.waitingConfirmation ?? 0)
const blockedUsers = computed(() => stats.value?.blockedUsers ?? 0)
const usersWithoutCompany = computed(() => stats.value?.usersWithoutCompany ?? 0)

const statusSummary = computed(() => {
  if (!stats.value) return []

  const active = Math.max(0, totalUsers.value - pendingUsers.value - blockedUsers.value)

  return [
    { label: 'Ativos', total: active },
    { label: 'Aguardando confirmação', total: pendingUsers.value },
    { label: 'Bloqueados', total: blockedUsers.value },
    { label: 'Sem empresa', total: usersWithoutCompany.value },
  ]
})

const chartData = computed(() => {
  const series = stats.value?.series ?? []

  return {
    labels: series.map((point) => point.label),
    datasets: [
      {
        label: 'Usuários',
        data: series.map((point) => point.users),
        borderColor: '#209CEE',
        backgroundColor: '#209CEE',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Empresas',
        data: series.map((point) => point.companies),
        borderColor: '#00D1B2',
        backgroundColor: '#00D1B2',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
        fill: false,
      },
    ],
  }
})

const recentUsers = computed(() =>
  [...store.users].sort((a, b) => toTime(b.createdDate) - toTime(a.createdDate)).slice(0, 5),
)

const recentCompanies = computed(() =>
  [...store.companies]
    .sort((a, b) => toTime(b.createdDate) - toTime(a.createdDate))
    .slice(0, 5),
)

const shortcuts = [
  { label: 'Estudos', href: `${origin}/app/study/`, icon: mdiBookOpenPageVariantOutline, color: 'text-violet-500' },
  { label: 'CRM', href: `${origin}/app/crm/`, icon: mdiBriefcaseOutline, color: 'text-indigo-500' },
  { label: 'Finanças', href: `${origin}/app/finances/`, icon: mdiCashMultiple, color: 'text-emerald-500' },
  { label: 'Fitness', href: `${origin}/app/fitness/`, icon: mdiDumbbell, color: 'text-orange-500' },
  { label: 'Portfólio', href: `${origin}/app/portfolio/`, icon: mdiSitemap, color: 'text-pink-500' },
]
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Visão geral" main>
        <BaseButton :icon="mdiRefresh" color="whiteDark" small @click="reload" />
      </SectionTitleLineWithButton>

      <NotificationBar v-if="store.error" color="danger" :icon="mdiAlertCircleOutline">
        {{ store.error }}
      </NotificationBar>

      <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <CardBoxWidget
          color="text-indigo-500"
          :icon="mdiAccountMultiple"
          :number="totalUsers"
          label="Usuários"
        />
        <CardBoxWidget
          color="text-emerald-500"
          :icon="mdiDomain"
          :number="totalCompanies"
          label="Empresas"
        />
        <CardBoxWidget
          color="text-yellow-500"
          :icon="mdiAccountClockOutline"
          :number="pendingUsers"
          label="Aguardando confirmação"
        />
        <CardBoxWidget
          color="text-red-500"
          :icon="mdiAccountCancelOutline"
          :number="blockedUsers"
          label="Bloqueados"
        />
        <CardBoxWidget
          color="text-zinc-500"
          :icon="mdiAccountOffOutline"
          :number="usersWithoutCompany"
          label="Usuários sem empresa"
        />
      </div>

      <CardBox class="mb-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-lg font-semibold">Cadastros no período</h3>
          <div class="flex flex-wrap gap-2">
            <select
              v-model.number="range"
              class="h-10 rounded-sm border border-zinc-700 bg-white px-3 text-sm dark:bg-zinc-800"
              :disabled="statsLoading"
              @change="loadStats"
            >
              <option v-for="item in RANGE_OPTIONS" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
            <select
              v-model="interval"
              class="h-10 rounded-sm border border-zinc-700 bg-white px-3 text-sm dark:bg-zinc-800"
              :disabled="statsLoading"
              @change="loadStats"
            >
              <option v-for="item in INTERVAL_OPTIONS" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>
        </div>
        <div v-if="stats?.series?.length" class="h-64">
          <LineChart :data="chartData" />
        </div>
        <p v-else class="text-sm text-zinc-500 dark:text-zinc-400">
          {{ statsLoading ? 'Carregando dados do período...' : 'Nenhum dado no período selecionado.' }}
        </p>
        <div class="mt-3 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <span class="inline-flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-[#209CEE]" /> Usuários
          </span>
          <span class="inline-flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full bg-[#00D1B2]" /> Empresas
          </span>
        </div>
      </CardBox>

      <div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CardBox>
          <h3 class="mb-4 text-lg font-semibold">Usuários por status</h3>
          <ul v-if="statusSummary.length" class="space-y-3">
            <li
              v-for="item in statusSummary"
              :key="item.label"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-zinc-600 dark:text-zinc-300">{{ item.label }}</span>
              <span class="font-semibold">{{ item.total }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-zinc-500 dark:text-zinc-400">Nenhum usuário cadastrado.</p>
        </CardBox>

        <CardBox>
          <h3 class="mb-4 text-lg font-semibold">Empresas recentes</h3>
          <ul v-if="recentCompanies.length" class="space-y-3">
            <li
              v-for="company in recentCompanies"
              :key="company.id"
              class="flex items-center justify-between text-sm"
            >
              <NuxtLink
                :to="`/clientes/empresas/${company.id}`"
                class="text-zinc-700 hover:text-indigo-600 dark:text-zinc-200 dark:hover:text-indigo-400"
              >
                {{ company.name || 'Sem nome' }}
              </NuxtLink>
              <span class="text-zinc-500 dark:text-zinc-400">
                {{ formatDate(company.createdDate) }}
              </span>
            </li>
          </ul>
          <p v-else class="text-sm text-zinc-500 dark:text-zinc-400">Nenhuma empresa cadastrada.</p>
        </CardBox>
      </div>

      <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Usuários recentes" />

      <CardBox class="mb-6" has-table>
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Empresa</th>
              <th>Status</th>
              <th>Criado em</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in recentUsers" :key="user.id">
              <td data-label="Usuário">
                <NuxtLink
                  :to="`/clientes/usuarios/${user.id}`"
                  class="text-zinc-700 hover:text-indigo-600 dark:text-zinc-200 dark:hover:text-indigo-400"
                >
                  {{ user.username || user.name }}
                </NuxtLink>
              </td>
              <td data-label="E-mail">{{ user.email || '—' }}</td>
              <td data-label="Empresa">{{ user.companyName || 'Sem empresa' }}</td>
              <td data-label="Status">{{ statusLabels[user.status] ?? user.status ?? '—' }}</td>
              <td data-label="Criado em">{{ formatDate(user.createdDate) }}</td>
            </tr>
            <tr v-if="!recentUsers.length">
              <td colspan="5" class="py-8 text-center text-zinc-500">Nenhum usuário cadastrado.</td>
            </tr>
          </tbody>
        </table>
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiSitemap" title="Acessos rápidos" />

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <a
          v-for="shortcut in shortcuts"
          :key="shortcut.label"
          :href="shortcut.href"
          target="_blank"
          class="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:border-indigo-500"
        >
          <BaseIcon :path="shortcut.icon" :size="24" :class="shortcut.color" />
          {{ shortcut.label }}
        </a>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
