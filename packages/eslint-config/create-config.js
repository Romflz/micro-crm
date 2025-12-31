import { globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// Shared rules across all configs
const sharedRules = {
  // ============================================
  // BUG PREVENTION
  // ============================================

  // Disable base rule - conflicts with TS version
  'no-unused-vars': 'off',

  // Catches typos and dead code. Underscore prefix for intentionally unused.
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],

  // Catches === vs = typos in conditions
  'no-cond-assign': 'error',

  // Catches unreachable code
  'no-unreachable': 'error',

  // Prevents comma operator mistakes: (a, b) returns only b
  'no-sequences': 'error',

  // Catches expressions that do nothing
  'no-unused-expressions': [
    'error',
    {
      allowShortCircuit: true,
      allowTernary: true,
    },
  ],

  // ============================================
  // TYPESCRIPT
  // ============================================

  // Warns on 'any' type - try to be specific
  '@typescript-eslint/no-explicit-any': 'warn',

  // Prevents non-null assertions (!) without justification
  '@typescript-eslint/no-non-null-assertion': 'warn',

  // ============================================
  // CODE QUALITY
  // ============================================

  // Forces const when variable is never reassigned
  'prefer-const': 'error',

  // Disallows var - use let or const
  'no-var': 'error',

  // Forces === instead of == (except null checks)
  eqeqeq: ['error', 'always', { null: 'ignore' }],

  // Requires break in switch cases
  'no-fallthrough': 'error',

  // ============================================
  // MODERN SYNTAX
  // ============================================

  // Prefer { name } over { name: name }
  'object-shorthand': ['error', 'always'],

  // Prefer x => x * 2 over x => { return x * 2 }
  'arrow-body-style': ['warn', 'as-needed'],

  // Prefer template literals over concatenation
  'prefer-template': 'warn',
}

// Vue Specific rules
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
  const {
    type = 'app', // 'app' or 'lib'
    vue = false,
    tsconfigRootDir = '.',
    ignores = [],
    ...restOptions
  } = options

  const defaultIgnores = ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/public/**', '**/dist-ssr/**', ...ignores]

  // Base TypeScript config
  if (!vue) {
    return [
      {
        name: 'repo/files-to-lint',
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
      },

      globalIgnores(defaultIgnores),

      ...tseslint.configs.recommended,

      {
        name: 'repo/typescript',
        files: ['**/*.{ts,mts,cts}'],
        languageOptions: {
          parserOptions: {
            tsconfigRootDir,
          },
        },
        rules: sharedRules,
      },

      // User overrides
      Object.keys(restOptions).length > 0 ? restOptions : null,
      ...userConfigs,
    ].filter(Boolean)
  }

  // Vue + TypeScript config
  const vueConfigs = [
    {
      name: 'repo/files-to-lint',
      files: ['**/*.{ts,mts,tsx,vue}'],
    },

    globalIgnores(defaultIgnores),

    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,
    skipFormatting,

    {
      name: 'repo/custom-rules',
      languageOptions: {
        parserOptions: {
          tsconfigRootDir,
        },
      },
      rules: {
        ...sharedRules,
        ...vueRules,
      },
    },
  ]

  // Add user configs
  if (Object.keys(restOptions).length > 0) {
    vueConfigs.push(restOptions)
  }
  vueConfigs.push(...userConfigs)

  return defineConfigWithVueTs(...vueConfigs)
}
