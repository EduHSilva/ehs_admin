<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { mdiDelete, mdiDownload, mdiEye } from '@mdi/js'
import BaseButton from '../components/BaseButton.vue'
import BaseButtons from '../components/BaseButtons.vue'
import CardBoxModal from '../components/CardBoxModal.vue'
import FormControl from '../components/FormControl.vue'
import { clientsStore } from '../stores/clientsStore'

const SORT_OPTIONS = [
  { value: 'createdDate:desc', label: 'Mais recentes' },
  { value: 'createdDate:asc', label: 'Mais antigas' },
  { value: 'name:asc', label: 'Nome A-Z' },
  { value: 'name:desc', label: 'Nome Z-A' },
]

const store = clientsStore()
const formatDate = (date) => (date ? new Date(date).toLocaleDateString('pt-BR') : '—')

const search = ref('')
const sortOption = ref('createdDate:desc')
const currentPage = ref(0)
const pageSize = ref(10)
const exporting = ref(false)

const sortField = computed(() => sortOption.value.split(':')[0])
const sortDirection = computed(() => sortOption.value.split(':')[1])
const numPages = computed(() =>
  Math.max(1, Math.ceil(store.companiesMeta.total / (store.companiesMeta.size || pageSize.value))),
)

let debounceTimer
function scheduleLoad() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => load(true), 300)
}

function load(resetPage = false) {
  if (resetPage) currentPage.value = 0

  return store.fetchCompanies({
    page: currentPage.value,
    size: pageSize.value,
    q: search.value,
    sort: sortField.value,
    direction: sortDirection.value,
  })
}

watch(search, scheduleLoad)
watch([sortOption, pageSize], () => load(true))
watch(currentPage, () => load())
onMounted(() => load())

async function exportCsv() {
  exporting.value = true
  await store.exportCompaniesCsv({ q: search.value })
  exporting.value = false
}

const companyToDelete = ref(null)
const isDeleting = ref(false)

const isDeleteModalOpen = computed({
  get: () => Boolean(companyToDelete.value),
  set: (value) => {
    if (!value) companyToDelete.value = null
  },
})

const askDelete = (company) => {
  companyToDelete.value = company
}

const confirmDelete = async () => {
  if (!companyToDelete.value) return

  isDeleting.value = true
  const deleted = await store.deleteCompany(companyToDelete.value.id)
  isDeleting.value = false

  if (deleted) {
    companyToDelete.value = null

    if (!store.companies.length && currentPage.value > 0) {
      currentPage.value -= 1
    } else {
      await load()
    }
  }
}
</script>

<template>
  <div class="grid gap-3 border-b border-zinc-100 p-4 md:grid-cols-3 dark:border-zinc-800">
    <FormControl v-model="search" placeholder="Buscar por nome da empresa" />
    <select v-model="sortOption" class="h-12 rounded-sm border border-zinc-700 bg-white px-3 dark:bg-zinc-800">
      <option v-for="item in SORT_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</option>
    </select>
    <BaseButton
      color="whiteDark"
      :icon="mdiDownload"
      label="Exportar CSV"
      :disabled="exporting || store.isLoading"
      @click="exportCsv"
    />
  </div>
  <table>
    <thead><tr><th>Nome da empresa</th><th>Data de criação</th><th>Quantidade de usuários</th><th /></tr></thead>
    <tbody>
      <tr v-for="company in store.companies" :key="company.id">
        <td data-label="Nome da empresa">{{ company.name }}</td>
        <td data-label="Data de criação">{{ formatDate(company.createdDate || company.createdAt) }}</td>
        <td data-label="Quantidade de usuários">{{ company.usersCount ?? company.userCount ?? company.users?.length ?? 0 }}</td>
        <td class="whitespace-nowrap before:hidden lg:w-1">
          <BaseButton :to="`/clientes/empresas/${company.id}`" color="info" :icon="mdiEye" small title="Ver detalhes" />
          <BaseButton color="danger" :icon="mdiDelete" small title="Excluir empresa" @click="askDelete(company)" />
        </td>
      </tr>
      <tr v-if="!store.companies.length"><td colspan="4" class="py-8 text-center text-zinc-500">Nenhuma empresa encontrada.</td></tr>
    </tbody>
  </table>
  <div class="border-t border-zinc-100 p-3 lg:px-6 dark:border-zinc-800">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <BaseButtons>
        <BaseButton
          color="whiteDark"
          label="Anterior"
          small
          :disabled="currentPage === 0 || store.isLoading"
          @click="currentPage -= 1"
        />
        <BaseButton
          color="whiteDark"
          label="Próxima"
          small
          :disabled="currentPage + 1 >= numPages || store.isLoading"
          @click="currentPage += 1"
        />
      </BaseButtons>
      <small>
        Página {{ currentPage + 1 }} de {{ numPages }} · {{ store.companiesMeta.total }} registro(s)
      </small>
    </div>
  </div>

  <CardBoxModal
    v-model="isDeleteModalOpen"
    title="Excluir empresa"
    button="danger"
    button-label="Excluir"
    has-cancel
    :is-processing="isDeleting"
    @confirm="confirmDelete"
  >
    <p>
      Tem certeza que deseja excluir a empresa
      <b>{{ companyToDelete?.name }}</b>? Todos os usuários vinculados a ela também serão excluídos.
    </p>
  </CardBoxModal>
</template>
