<script setup>
import { reactive, ref } from 'vue'
import { signIn } from '../services/auth'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '../components/SectionFullScreen.vue'
import CardBox from '../components/CardBox.vue'
import FormField from '../components/FormField.vue'
import FormControl from '../components/FormControl.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseButtons from '../components/BaseButtons.vue'
import LayoutGuest from '../layouts/LayoutGuest.vue'

const form = reactive({
  email: '',
  password: '',
})

const router = useRouter()
const errorMessage = ref('')
const isSubmitting = ref(false)

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
        :class="[cardClass, 'border border-slate-200/80 dark:border-slate-700']"
        is-form
        @submit.prevent="submit"
      >
        <div class="mb-8 text-center">
          <div
            class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20"
          >
            E
          </div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            EHS Admin
          </h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Acesse o painel de administração
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

        <template #footer>
          <BaseButtons>
            <BaseButton
              type="submit"
              color="info"
              :label="isSubmitting ? 'Entrando...' : 'Entrar'"
              :disabled="isSubmitting"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
