<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { mdiAccount, mdiLogoutVariant, mdiMail } from '@mdi/js'
import SectionMain from '../components/SectionMain.vue'
import CardBox from '../components/CardBox.vue'
import FormField from '../components/FormField.vue'
import FormControl from '../components/FormControl.vue'
import NotificationBar from '../components/NotificationBar.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseButtons from '../components/BaseButtons.vue'
import UserCard from '../components/UserCard.vue'
import LayoutAuthenticated from '../layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton.vue'
import { clientsStore } from '../stores/clientsStore'
import { getUser, logoutAllSessions, updateStoredUser } from '../services/auth'

const router = useRouter()
const session = getUser()
const store = clientsStore()

if (session?.id) {
  await store.fetchUser(session.id)
}

const user = computed(
  () => store.users.find((item) => String(item.id) === String(session?.id)) ?? session,
)

const form = reactive({ username: '', email: '' })
const saving = ref(false)
const successMessage = ref('')
const validationError = ref('')

watch(
  user,
  (value) => {
    if (!value) return
    form.username = value.username ?? ''
    form.email = value.email ?? ''
  },
  { immediate: true },
)

async function submit() {
  validationError.value = ''
  successMessage.value = ''

  if (!session?.id) {
    validationError.value = 'Sessão inválida. Faça login novamente.'
    return
  }

  const username = form.username.trim()
  const email = form.email.trim()

  if (!username || !email) {
    validationError.value = 'Nome de usuário e e-mail são obrigatórios.'
    return
  }

  saving.value = true
  const saved = await store.saveUser(session.id, { username, email })
  saving.value = false

  if (saved) {
    updateStoredUser({ username, email })
    successMessage.value = 'Dados atualizados com sucesso.'
  }
}

const endingSessions = ref(false)

async function endSessions() {
  if (!window.confirm('Encerrar todas as sessões? Você precisará entrar novamente.')) {
    return
  }

  validationError.value = ''
  successMessage.value = ''
  endingSessions.value = true

  try {
    await logoutAllSessions()
    await router.push('/login')
  } catch {
    validationError.value = 'Não foi possível encerrar as sessões.'
  } finally {
    endingSessions.value = false
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Perfil" main />

      <UserCard v-if="user" :user="user" :last-login="session?.lastLogin" class="mb-6" />
      <CardBox v-else class="mb-6"><p>Não foi possível carregar seus dados.</p></CardBox>

      <CardBox is-form @submit.prevent="submit">
        <NotificationBar v-if="store.error" color="danger" class="mb-5">
          Não foi possível salvar as alterações. {{ store.error }}
        </NotificationBar>
        <NotificationBar v-if="validationError" color="danger" class="mb-5">
          {{ validationError }}
        </NotificationBar>
        <NotificationBar v-if="successMessage" color="success" class="mb-5">
          {{ successMessage }}
        </NotificationBar>

        <FormField label="Nome de usuário" help="Exibido no painel e nos registros.">
          <FormControl
            v-model="form.username"
            :icon="mdiAccount"
            name="username"
            required
            maxlength="150"
            autocomplete="username"
          />
        </FormField>
        <FormField label="E-mail" help="Também usado para entrar no painel.">
          <FormControl
            v-model="form.email"
            :icon="mdiMail"
            type="email"
            name="email"
            required
            maxlength="150"
            autocomplete="email"
          />
        </FormField>

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

      <CardBox class="mt-6">
        <h3 class="mb-2 text-lg font-semibold">Sessões</h3>
        <p class="mb-4 text-sm text-zinc-600 dark:text-zinc-300">
          Encerra o acesso de todos os dispositivos que usam a sua conta, incluindo este.
        </p>
        <BaseButton
          color="danger"
          :icon="mdiLogoutVariant"
          label="Encerrar todas as sessões"
          :disabled="endingSessions"
          @click="endSessions"
        />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
