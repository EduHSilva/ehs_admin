<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { mdiDownload, mdiEye } from '@mdi/js'
import BaseButtons from '../components/BaseButtons.vue'
import BaseButton from '../components/BaseButton.vue'
import FormControl from '../components/FormControl.vue'
import UserAvatar from '../components/UserAvatar.vue'
import { clientsStore } from '../stores/clientsStore'

const ROLE_OPTIONS = [
  'ADMIN',
  'BUDGETS',
  'FINANCES',
  'HEALTH_USER',
  'HEALTH_PERSONAL',
  'HEALTH_NUTRITIONIST',
  'STUDY',
]
const STATUS_OPTIONS = [
  { value: 'OK', label: 'Ativo' },
  { value: 'WAITING_CONFIRMATION', label: 'Aguardando confirmação' },
  { value: 'BLOCKED', label: 'Bloqueado' },
]
const STATUS_LABELS = {
  OK: 'Ativo',
  WAITING_CONFIRMATION: 'Aguardando confirmação',
  BLOCKED: 'Bloqueado',
  DELETED: 'Excluído',
}
const SORT_OPTIONS = [
  { value: 'createdDate:desc', label: 'Mais recentes' },
  { value: 'createdDate:asc', label: 'Mais antigos' },
  { value: 'username:asc', label: 'Nome A-Z' },
  { value: 'username:desc', label: 'Nome Z-A' },
  { value: 'email:asc', label: 'E-mail A-Z' },
  { value: 'lastLogin:desc', label: 'Último acesso' },
]

const usersStore = clientsStore()
const search = ref('')
const role = ref('')
const status = ref('')
const sortOption = ref('createdDate:desc')
const currentPage = ref(0)
const pageSize = ref(10)
const exporting = ref(false)

const sortField = computed(() => sortOption.value.split(':')[0])
const sortDirection = computed(() => sortOption.value.split(':')[1])
const numPages = computed(() =>
  Math.max(1, Math.ceil(usersStore.usersMeta.total / (usersStore.usersMeta.size || pageSize.value))),
)

let debounceTimer
function scheduleLoad() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => load(true), 300)
}

function load(resetPage = false) {
  if (resetPage) currentPage.value = 0

  return usersStore.fetchUsers({
    page: currentPage.value,
    size: pageSize.value,
    q: search.value,
    role: role.value,
    status: status.value,
    sort: sortField.value,
    direction: sortDirection.value,
  })
}

watch(search, scheduleLoad)
watch([role, status, sortOption, pageSize], () => load(true))
watch(currentPage, () => load())
onMounted(() => load())

async function exportCsv() {
  exporting.value = true
  await usersStore.exportUsersCsv({ q: search.value, role: role.value, status: status.value })
  exporting.value = false
}
</script>

<template>
  <div class="grid gap-3 border-b border-zinc-100 p-4 md:grid-cols-2 xl:grid-cols-5 dark:border-zinc-800">
    <FormControl v-model="search" placeholder="Buscar por nome ou e-mail" />
    <select v-model="role" class="h-12 rounded-sm border border-zinc-700 bg-white px-3 dark:bg-zinc-800">
      <option value="">Todas as permissões</option>
      <option v-for="item in ROLE_OPTIONS" :key="item" :value="item">{{ item }}</option>
    </select>
    <select v-model="status" class="h-12 rounded-sm border border-zinc-700 bg-white px-3 dark:bg-zinc-800">
      <option value="">Todos os status</option>
      <option v-for="item in STATUS_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</option>
    </select>
    <select v-model="sortOption" class="h-12 rounded-sm border border-zinc-700 bg-white px-3 dark:bg-zinc-800">
      <option v-for="item in SORT_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</option>
    </select>
    <BaseButton
      color="whiteDark"
      :icon="mdiDownload"
      label="Exportar CSV"
      :disabled="exporting || usersStore.isLoading"
      @click="exportCsv"
    />
  </div>
  <table>
    <thead><tr><th /><th>Nome</th><th>E-mail</th><th>Empresa</th><th>Status</th><th>Permissões</th><th /></tr></thead>
    <tbody>
      <tr v-for="user in usersStore.users" :key="user.id">
        <td class="border-b-0 before:hidden lg:w-6"><UserAvatar :username="user.username || user.name" class="mx-auto h-8 w-8" /></td>
        <td data-label="Nome">{{ user.username || user.name }}</td>
        <td data-label="E-mail">{{ user.email || '—' }}</td>
        <td data-label="Empresa">{{ user.companyName || 'Sem empresa' }}</td>
        <td data-label="Status">{{ STATUS_LABELS[user.status] ?? user.status ?? '—' }}</td>
        <td data-label="Permissões">{{ (user.roles || []).join(', ') || '—' }}</td>
        <td class="whitespace-nowrap before:hidden lg:w-1"><BaseButton :to="`/clientes/usuarios/${user.id}`" color="info" :icon="mdiEye" small /></td>
      </tr>
      <tr v-if="!usersStore.users.length"><td colspan="7" class="py-8 text-center text-zinc-500">Nenhum usuário encontrado.</td></tr>
    </tbody>
  </table>
  <div class="border-t border-zinc-100 p-3 lg:px-6 dark:border-zinc-800">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <BaseButtons>
        <BaseButton
          color="whiteDark"
          label="Anterior"
          small
          :disabled="currentPage === 0 || usersStore.isLoading"
          @click="currentPage -= 1"
        />
        <BaseButton
          color="whiteDark"
          label="Próxima"
          small
          :disabled="currentPage + 1 >= numPages || usersStore.isLoading"
          @click="currentPage += 1"
        />
      </BaseButtons>
      <small>
        Página {{ currentPage + 1 }} de {{ numPages }} · {{ usersStore.usersMeta.total }} registro(s)
      </small>
    </div>
  </div>
</template>
