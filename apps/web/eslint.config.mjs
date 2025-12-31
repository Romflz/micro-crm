import createConfig from '@repo/eslint-config/create-config'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default createConfig({
  vue: true,
  tsconfigRootDir: __dirname,
})
