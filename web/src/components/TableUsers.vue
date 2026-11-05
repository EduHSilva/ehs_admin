<script setup>
import { computed, ref, watch } from 'vue'
import { mdiEye } from '@mdi/js'
import BaseLevel from '../components/BaseLevel.vue'
import BaseButtons from '../components/BaseButtons.vue'
import BaseButton from '../components/BaseButton.vue'
import FormControl from '../components/FormControl.vue'
import UserAvatar from '../components/UserAvatar.vue'
import { clientsStore } from '../stores/clientsStore'

const usersStore = clientsStore()
const search = ref('')
const role = ref('')
const company = ref('')
const perPage = 10
const currentPage = ref(0)

const roles = computed(() => [...new Set(usersStore.users.flatMap((user) => user.roles || []))].sort())
const companies = computed(() => [...new Set(usersStore.users.map((user) => user.companyName).filter(Boolean))].sort())
const filteredItems = computed(() => {
  const term = search.value.trim().toLocaleLowerCase()
  return usersStore.users.filter((user) => {
    const matchesTerm = !term || [user.username, user.name, user.email].filter(Boolean)
      .some((value) => value.toLocaleLowerCase().includes(term))
    const matchesRole = !role.value || (user.roles || []).includes(role.value)
    const matchesCompany = !company.value || (company.value === '__none__'
      ? !user.companyName
      : user.companyName === company.value)
    return matchesTerm && matchesRole && matchesCompany
  })
})
const numPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / perPage)))
const itemsPaginated = computed(() => filteredItems.value.slice(currentPage.value * perPage, (currentPage.value + 1) * perPage))
watch([search, role, company], () => { currentPage.value = 0 })
watch(numPages, (pages) => { if (currentPage.value >= pages) currentPage.value = pages - 1 })
</script>

<template>
  <div class="grid gap-3 border-b border-gray-100 p-4 md:grid-cols-3 dark:border-slate-800">
    <FormControl v-model="search" placeholder="Buscar por nome ou e-mail" />
    <select v-model="role" class="h-12 rounded-sm border border-gray-700 bg-white px-3 dark:bg-slate-800">
      <option value="">Todas as permissões</option>
      <option v-for="item in roles" :key="item" :value="item">{{ item }}</option>
    </select>
    <select v-model="company" class="h-12 rounded-sm border border-gray-700 bg-white px-3 dark:bg-slate-800">
      <option value="">Todas as empresas</option>
      <option value="__none__">Sem empresa</option>
      <option v-for="item in companies" :key="item" :value="item">{{ item }}</option>
    </select>
  </div>
  <table>
    <thead><tr><th /><th>Nome</th><th>E-mail</th><th>Empresa</th><th>Status</th><th>Permissões</th><th /></tr></thead>
    <tbody>
      <tr v-for="user in itemsPaginated" :key="user.id">
        <td class="border-b-0 before:hidden lg:w-6"><UserAvatar :username="user.username || user.name" class="mx-auto h-8 w-8" /></td>
        <td data-label="Nome">{{ user.username || user.name }}</td>
        <td data-label="E-mail">{{ user.email || '—' }}</td>
        <td data-label="Empresa">{{ user.companyName || 'Sem empresa' }}</td>
        <td data-label="Status">{{ user.status || '—' }}</td>
        <td data-label="Permissões">{{ (user.roles || []).join(', ') || '—' }}</td>
        <td class="whitespace-nowrap before:hidden lg:w-1"><BaseButton :to="`/clientes/usuarios/${user.id}`" color="info" :icon="mdiEye" small /></td>
      </tr>
      <tr v-if="!itemsPaginated.length"><td colspan="7" class="py-8 text-center text-gray-500">Nenhum usuário encontrado.</td></tr>
    </tbody>
  </table>
  <div class="border-t border-gray-100 p-3 lg:px-6 dark:border-slate-800">
    <BaseLevel><BaseButtons><BaseButton v-for="page in numPages" :key="page" :active="page - 1 === currentPage" :label="page" :color="page - 1 === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page - 1" /></BaseButtons><small>Página {{ currentPage + 1 }} de {{ numPages }}</small></BaseLevel>
  </div>
</template>
