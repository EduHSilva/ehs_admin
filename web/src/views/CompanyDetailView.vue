<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { mdiDomain } from '@mdi/js'
import SectionMain from '../components/SectionMain.vue'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton.vue'
import LayoutAuthenticated from '../layouts/LayoutAuthenticated.vue'
import CardBox from '../components/CardBox.vue'
import FormField from '../components/FormField.vue'
import FormControl from '../components/FormControl.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseButtons from '../components/BaseButtons.vue'
import { clientsStore } from '../stores/clientsStore'

const props = defineProps({ id: { type: [String, Number], required: true } })
const store = clientsStore()
if (!store.companies.length) await store.fetchCompanies()
const company = computed(() => store.companies.find((item) => String(item.id) === String(props.id)))
const form = reactive({ name: '', createdDate: '', usersCount: 0 })
const saved = ref(false)
watch(company, (value) => {
  if (!value) return
  Object.assign(form, { name: value.name || '', createdDate: value.createdDate || value.createdAt || '', usersCount: value.usersCount ?? value.userCount ?? 0 })
}, { immediate: true })
function submit() { store.updateCompany({ ...company.value, ...form }); saved.value = true }
</script>

<template>
  <LayoutAuthenticated><SectionMain>
    <SectionTitleLineWithButton :icon="mdiDomain" :title="company ? `Empresa: ${company.name}` : 'Empresa'" main><BaseButton to="/clientes" label="Voltar" color="whiteDark" /></SectionTitleLineWithButton>
    <CardBox v-if="company" is-form @submit.prevent="submit">
      <p v-if="saved" class="mb-5 rounded bg-green-50 p-3 text-green-700">Alterações salvas localmente.</p>
      <div class="grid gap-6 lg:grid-cols-2"><FormField label="Nome da empresa"><FormControl v-model="form.name" required /></FormField><FormField label="Data de criação"><FormControl v-model="form.createdDate" type="date" /></FormField><FormField label="Quantidade de usuários"><FormControl v-model="form.usersCount" type="number" /></FormField></div>
      <template #footer><BaseButtons><BaseButton type="submit" color="info" label="Salvar alterações" /></BaseButtons></template>
    </CardBox>
    <CardBox v-else><p>Empresa não encontrada.</p></CardBox>
  </SectionMain></LayoutAuthenticated>
</template>
