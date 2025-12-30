import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { sharedRules } from './base.js'

// Vue Specific rules that we load inside createConfig
const vueRules = {
  // Warns on single-word component names (conflict with HTML elements)
  'vue/multi-word-component-names': 'warn',

  // Requires type definitions on props
  'vue/require-prop-types': 'warn',

  // Requires default values for non-required props
  'vue/require-default-prop': 'warn',

  // Prevents directly mutating props
  'vue/no-mutating-props': 'error',

  // Catches unused components in template
  'vue/no-unused-components': 'error',

  // Catches unused v-for variables
  'vue/no-unused-vars': 'error',

  // Enforces consistent order: script, template, style
  'vue/block-order': [
    'error',
    {
      order: ['script', 'template', 'style'],
    },
  ],

  // Prevents v-if and v-for on same element (performance)
  'vue/no-use-v-if-with-v-for': 'error',

  // Requires :key on v-for
  'vue/require-v-for-key': 'error',

  // Enforces v-bind style (:prop vs v-bind:prop)
  'vue/v-bind-style': ['error', 'shorthand'],

  // Enforces v-on style (@click vs v-on:click)
  'vue/v-on-style': ['error', 'shorthand'],
}

export default function createConfig(options = {}, ...userConfigs) {
  return defineConfigWithVueTs(
    {
      name: 'repo/files-to-lint',
      files: ['**/*.{ts,mts,tsx,vue}'],
    },

    globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**']),

    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,
    skipFormatting,

    {
      name: 'repo/custom-rules',
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: '.',
        },
      },
      rules: {
        ...sharedRules,
        ...vueRules,
      },
    },

    // User overrides
    Object.keys(options).length > 0 ? options : null,
    ...userConfigs
  ).filter(Boolean)
}
