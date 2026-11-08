<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { mdiAccount } from '@mdi/js'
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

const ROLE_OPTIONS = [
  'ADMIN',
  'BUDGETS',
  'FINANCES',
  'HEALTH_USER',
  'HEALTH_PERSONAL',
  'HEALTH_NUTRITIONIST',
  'STUDY',
]
const STATUS_LABELS = {
  OK: 'Ativo',
  WAITING_CONFIRMATION: 'Aguardando confirmação',
  BLOCKED: 'Bloqueado',
  DELETED: 'Excluído',
}

const props = defineProps({ id: { type: [String, Number], required: true } })
const store = clientsStore()
if (!store.users.some((item) => String(item.id) === String(props.id))) {
  await store.fetchUser(props.id)
}

const user = computed(() => store.users.find((item) => String(item.id) === String(props.id)))
const form = reactive({ username: '', email: '', roles: '' })
const saving = ref(false)
const actionLoading = ref('')
const successMessage = ref('')
const validationError = ref('')

watch(
  user,
  (value) => {
    if (!value) return
    Object.assign(form, {
      username: value.username ?? '',
      email: value.email ?? '',
      roles: (value.roles ?? []).join(', '),
    })
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

  const roles = form.roles
    .split(',')
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean)
  const invalidRoles = roles.filter((role) => !ROLE_OPTIONS.includes(role))

  if (!roles.length) {
    validationError.value = 'Informe ao menos uma permissão.'
    return
  }

  if (invalidRoles.length) {
    validationError.value = `Permissões inválidas: ${invalidRoles.join(', ')}.`
    return
  }

  saving.value = true
  const saved = await store.saveUser(props.id, {
    username: form.username.trim(),
    email: form.email.trim() || null,
    roles,
  })
  saving.value = false

  if (saved) {
    form.roles = roles.join(', ')
    successMessage.value = 'Alterações salvas com sucesso.'
  }
}

async function changeStatus(status) {
  validationError.value = ''
  successMessage.value = ''

  if (
    status === 'BLOCKED' &&
    !window.confirm('Bloquear este usuário? As sessões ativas serão encerradas.')
  ) {
    return
  }

  actionLoading.value = status
  const saved = await store.updateUserStatus(props.id, status)
  actionLoading.value = ''

  if (saved) {
    successMessage.value =
      status === 'OK' ? 'Usuário liberado com sucesso.' : 'Usuário bloqueado com sucesso.'
  }
}

async function resendEmail() {
  validationError.value = ''
  successMessage.value = ''
  actionLoading.value = 'RESEND'
  const sent = await store.resendConfirmation(props.id)
  actionLoading.value = ''

  if (sent) {
    successMessage.value = 'E-mail de confirmação reenviado.'
  }
}
</script>

<template>
  <LayoutAuthenticated><SectionMain>
    <SectionTitleLineWithButton
      :icon="mdiAccount"
      :title="user ? `Usuário: ${user.username}` : 'Usuário'"
      main
    >
      <BaseButton to="/clientes" label="Voltar" color="whiteDark" />
    </SectionTitleLineWithButton>
    <CardBox v-if="user" is-form @submit.prevent="submit">
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
        <FormField label="Nome de usuário">
          <FormControl v-model="form.username" required maxlength="150" />
        </FormField>
        <FormField label="E-mail">
          <FormControl v-model="form.email" type="email" maxlength="150" />
        </FormField>
        <FormField
          label="Status"
          help="A confirmação de e-mail ativa a conta; administradores podem liberar ou bloquear manualmente."
        >
          <div
            class="flex h-12 items-center rounded-sm border border-zinc-700 bg-zinc-100 px-3 dark:bg-zinc-900"
          >
            {{ STATUS_LABELS[user.status] ?? user.status ?? '—' }}
          </div>
        </FormField>
        <FormField
          label="Permissões"
          :help="`Separe por vírgula. Opções: ${ROLE_OPTIONS.join(', ')}. Somente administradores podem atribuir ADMIN.`"
        >
          <FormControl v-model="form.roles" />
        </FormField>
        <FormField label="Empresa" help="A troca de empresa não é suportada pela API.">
          <div
            class="flex h-12 items-center rounded-sm border border-zinc-700 bg-zinc-100 px-3 dark:bg-zinc-900"
          >
            {{ user.companyName || 'Sem empresa' }}
          </div>
        </FormField>
        <FormField label="Criado em">
          <div
            class="flex h-12 items-center rounded-sm border border-zinc-700 bg-zinc-100 px-3 dark:bg-zinc-900"
          >
            {{ formatDate(user.createdDate) }}
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
          <BaseButton
            v-if="user.status === 'WAITING_CONFIRMATION' || user.status === 'BLOCKED'"
            color="success"
            label="Liberar uso"
            :disabled="Boolean(actionLoading) || store.isLoading"
            @click="() => changeStatus('OK')"
          />
          <BaseButton
            v-if="user.status === 'OK'"
            color="danger"
            label="Bloquear"
            :disabled="Boolean(actionLoading) || store.isLoading"
            @click="() => changeStatus('BLOCKED')"
          />
          <BaseButton
            v-if="user.status === 'WAITING_CONFIRMATION'"
            color="whiteDark"
            label="Reenviar e-mail"
            :disabled="Boolean(actionLoading) || store.isLoading"
            @click="resendEmail"
          />
        </BaseButtons>
      </template>
    </CardBox>
    <CardBox v-else><p>Usuário não encontrado.</p></CardBox>
  </SectionMain></LayoutAuthenticated>
</template>
