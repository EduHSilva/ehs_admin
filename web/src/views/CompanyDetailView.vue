<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { mdiDomain } from '@mdi/js'
import SectionMain from '../components/SectionMain.vue'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton.vue'
import LayoutAuthenticated from '../layouts/LayoutAuthenticated.vue'
import CardBox from '../components/CardBox.vue'
import FormField from '../components/FormField.vue'
import FormControl from '../components/FormControl.vue'
import NotificationBar from '../components/NotificationBar.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseButtons from '../components/BaseButtons.vue'
import { clientsStore } from '../stores/clientsStore'

const props = defineProps({ id: { type: [String, Number], required: true } })
const store = clientsStore()
if (!store.companies.some((item) => String(item.id) === String(props.id))) {
  await store.fetchCompany(props.id)
}

const company = computed(() =>
  store.companies.find((item) => String(item.id) === String(props.id)),
)
const usersCount = computed(() => company.value?.users?.length ?? 0)
const form = reactive({ name: '' })
const saving = ref(false)
const successMessage = ref('')
const validationError = ref('')

watch(
  company,
  (value) => {
    if (value) form.name = value.name ?? ''
  },
  { immediate: true },
)

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('pt-BR')
}

async function submit() {
  validationError.value = ''
  successMessage.value = ''

  const name = form.name.trim()
  if (!name) {
    validationError.value = 'Informe o nome da empresa.'
    return
  }

  saving.value = true
  const saved = await store.saveCompany(props.id, { name })
  saving.value = false

  if (saved) {
    form.name = name
    successMessage.value = 'Alterações salvas com sucesso.'
  }
}
</script>

<template>
  <LayoutAuthenticated><SectionMain>
    <SectionTitleLineWithButton
      :icon="mdiDomain"
      :title="company ? `Empresa: ${company.name}` : 'Empresa'"
      main
    >
      <BaseButton to="/clientes" label="Voltar" color="whiteDark" />
    </SectionTitleLineWithButton>
    <CardBox v-if="company" is-form @submit.prevent="submit">
      <NotificationBar v-if="store.error" color="danger" class="mb-5">
        Não foi possível salvar as alterações. {{ store.error }}
      </NotificationBar>
      <NotificationBar v-if="validationError" color="danger" class="mb-5">
        {{ validationError }}
      </NotificationBar>
      <NotificationBar v-if="successMessage" color="success" class="mb-5">
        {{ successMessage }}
      </NotificationBar>
      <div class="grid gap-6 lg:grid-cols-2">
        <FormField label="Nome da empresa">
          <FormControl v-model="form.name" required maxlength="150" />
        </FormField>
        <FormField label="Data de criação">
          <div
            class="flex h-12 items-center rounded-sm border border-zinc-700 bg-zinc-100 px-3 dark:bg-zinc-900"
          >
            {{ formatDate(company.createdDate) }}
          </div>
        </FormField>
        <FormField label="Quantidade de usuários">
          <div
            class="flex h-12 items-center rounded-sm border border-zinc-700 bg-zinc-100 px-3 dark:bg-zinc-900"
          >
            {{ usersCount }}
          </div>
        </FormField>
      </div>
      <template #footer>
        <BaseButtons>
          <BaseButton
            type="submit"
            color="info"
            label="Salvar alterações"
            :disabled="saving || store.isLoading"
          />
        </BaseButtons>
      </template>
    </CardBox>
    <CardBox v-else><p>Empresa não encontrada.</p></CardBox>
  </SectionMain></LayoutAuthenticated>
</template>
