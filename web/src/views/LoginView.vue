<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { signIn, signInWithGoogle } from '../services/auth'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '../components/SectionFullScreen.vue'
import CardBox from '../components/CardBox.vue'
import FormField from '../components/FormField.vue'
import FormControl from '../components/FormControl.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseButtons from '../components/BaseButtons.vue'
import EhsBrand from '../components/EhsBrand.vue'
import LayoutGuest from '../layouts/LayoutGuest.vue'

const form = reactive({
  email: '',
  password: '',
})

const router = useRouter()
const config = useRuntimeConfig()
const errorMessage = ref('')
const isSubmitting = ref(false)

const googleSlot = ref(null)
const googleEnabled = computed(() => Boolean(config.public.googleClientId))
const googleFailed = ref(false)

function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google)
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => (window.google ? resolve(window.google) : reject(new Error('Google indisponível')))
    script.onerror = () => reject(new Error('Falha ao carregar o Google'))
    document.head.appendChild(script)
  })
}

async function signInGoogle(idToken) {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await signInWithGoogle(idToken)
    await router.replace('/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Não foi possível entrar com o Google. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (!googleEnabled.value || !googleSlot.value) return

  try {
    const google = await loadGoogleIdentity()
    google.accounts.id.initialize({
      client_id: config.public.googleClientId,
      callback: (response) => {
        if (response.credential) void signInGoogle(response.credential)
      },
    })
    google.accounts.id.renderButton(googleSlot.value, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: 320,
    })
  } catch {
    googleFailed.value = true
  }
})

const submit = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await signIn(form)
    await router.replace('/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Não foi possível entrar. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="slateBlue">
      <CardBox
        :class="[cardClass, 'border border-zinc-200/80 dark:border-zinc-700']"
        is-form
        @submit.prevent="submit"
      >
        <div class="mb-8 text-center">
          <div class="mb-4 flex justify-center">
            <EhsBrand />
          </div>
          <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Acesse o painel
          </h1>
          <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Administração da plataforma EHS Solutions
          </p>
        </div>

        <p v-if="errorMessage" class="mb-6 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {{ errorMessage }}
        </p>

        <FormField label="E-mail" help="Use o e-mail cadastrado na plataforma">
          <FormControl
            v-model="form.email"
            :icon="mdiAccount"
            type="email"
            name="email"
            autocomplete="email"
            required
          />
        </FormField>

        <FormField label="Senha">
          <FormControl
            v-model="form.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
            required
          />
        </FormField>

        <p class="mb-4 text-right text-sm">
          <a href="/user/reset-password" class="text-indigo-600 hover:underline dark:text-indigo-400">
            Esqueci minha senha
          </a>
        </p>

        <template #footer>
          <div class="space-y-4">
            <BaseButtons>
              <BaseButton
                type="submit"
                color="info"
                :label="isSubmitting ? 'Entrando...' : 'Entrar'"
                :disabled="isSubmitting"
              />
            </BaseButtons>
            <template v-if="googleEnabled">
              <div v-if="!googleFailed" class="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                <span class="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                <span>ou</span>
                <span class="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
              </div>
              <div v-if="!googleFailed" ref="googleSlot" class="flex min-h-11 justify-center" />
              <p v-else class="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Não foi possível carregar o login com Google.
              </p>
            </template>
          </div>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
