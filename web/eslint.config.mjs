import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/.laravel-guide/**',
    '**/.nuxt-guide/**',
  ]),

  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        // Auto-imports do Nuxt: disponiveis sem import explicito.
        definePageMeta: 'readonly',
        navigateTo: 'readonly',
        useHead: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        useRuntimeConfig: 'readonly',
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    name: 'app/pages-are-routes',
    files: ['pages/**/*.vue'],
    rules: {
      // Arquivos em pages/ viram rotas: o nome define a URL e nao pode
      // ser renomeado so para satisfazer a regra.
      'vue/multi-word-component-names': 'off',
    },
  },
  skipFormatting,
])
