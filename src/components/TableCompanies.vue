<script setup>
import { computed } from 'vue'
import { mdiEye } from '@mdi/js'
import BaseButton from '../components/BaseButton.vue'
import { clientsStore } from '../stores/clientsStore'

const store = clientsStore()
const companies = computed(() => store.companies)
const formatDate = (date) => date ? new Date(date).toLocaleDateString('pt-BR') : '—'
</script>

<template>
  <table>
    <thead><tr><th>Nome da empresa</th><th>Data de criação</th><th>Quantidade de usuários</th><th /></tr></thead>
    <tbody>
      <tr v-for="company in companies" :key="company.id">
        <td data-label="Nome da empresa">{{ company.name }}</td>
        <td data-label="Data de criação">{{ formatDate(company.createdDate || company.createdAt) }}</td>
        <td data-label="Quantidade de usuários">{{ company.usersCount ?? company.userCount ?? 0 }}</td>
        <td class="whitespace-nowrap before:hidden lg:w-1"><BaseButton :to="`/clientes/empresas/${company.id}`" color="info" :icon="mdiEye" small /></td>
      </tr>
    </tbody>
  </table>
</template>
