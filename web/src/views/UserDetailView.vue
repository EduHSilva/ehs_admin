<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { mdiAccount } from '@mdi/js'
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
if (!store.users.length) await store.fetchUsers()
const user = computed(() => store.users.find((item) => String(item.id) === String(props.id)))
const form = reactive({ username: '', name: '', email: '', companyName: '', status: '', roles: '' })
const saved = ref(false)
watch(user, (value) => {
  if (!value) return
  Object.assign(form, { ...value, roles: (value.roles || []).join(', ') })
}, { immediate: true })
function submit() {
  store.updateUser({ ...user.value, ...form, roles: form.roles.split(',').map((item) => item.trim()).filter(Boolean) })
  saved.value = true
}
</script>

<template>
  <LayoutAuthenticated><SectionMain>
    <SectionTitleLineWithButton :icon="mdiAccount" :title="user ? `Usuário: ${user.username || user.name}` : 'Usuário'" main>
      <BaseButton to="/clientes" label="Voltar" color="whiteDark" />
    </SectionTitleLineWithButton>
    <CardBox v-if="user" is-form @submit.prevent="submit">
      <p v-if="saved" class="mb-5 rounded bg-green-50 p-3 text-green-700">Alterações salvas localmente.</p>
      <div class="grid gap-6 lg:grid-cols-2">
        <FormField label="Nome de usuário"><FormControl v-model="form.username" required /></FormField>
        <FormField label="Nome"><FormControl v-model="form.name" /></FormField>
        <FormField label="E-mail"><FormControl v-model="form.email" type="email" /></FormField>
        <FormField label="Empresa"><FormControl v-model="form.companyName" placeholder="Deixe vazio para sem empresa" /></FormField>
        <FormField label="Status"><FormControl v-model="form.status" /></FormField>
        <FormField label="Permissões" help="Separe as permissões por vírgula"><FormControl v-model="form.roles" /></FormField>
      </div>
      <template #footer><BaseButtons><BaseButton type="submit" color="info" label="Salvar alterações" /></BaseButtons></template>
    </CardBox>
    <CardBox v-else><p>Usuário não encontrado.</p></CardBox>
  </SectionMain></LayoutAuthenticated>
</template>
