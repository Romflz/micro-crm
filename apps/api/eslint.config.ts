import baseConfig from '@repo/eslint-config/base'

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
