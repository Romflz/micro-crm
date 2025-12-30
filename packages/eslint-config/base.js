import { globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

// Shared rules across all configs
export const sharedRules = {
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

export default function createConfig(options = {}, ...userConfigs) {
  return [
    {
      name: 'repo/files-to-lint',
      files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    },

    globalIgnores(['**/dist/**', '**/node_modules/**', '**/coverage/**']),

    ...tseslint.configs.recommended,

    {
      name: 'repo/typescript',
      files: ['**/*.{ts,mts,cts}'],
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: '.',
        },
      },
      rules: sharedRules,
    },

    // User overrides
    Object.keys(options).length > 0 ? options : null,
    ...userConfigs,
  ].filter(Boolean)
}
