import { clientSchema } from '@repo/env/client'

const parsed = clientSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(`Invalid env: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`)
}

export const env = parsed.data
