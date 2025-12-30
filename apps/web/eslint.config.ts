import baseConfig from '@repo/eslint-config/vue'

export default [
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...baseConfig,
]
