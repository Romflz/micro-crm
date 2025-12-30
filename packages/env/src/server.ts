import { z } from 'zod'

const serverSchema = z.object({
  SERVER_URL: z.string(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type ServerEnv = z.infer<typeof serverSchema>

export function parseServerEnv(): ServerEnv {
  const parsed = serverSchema.safeParse(process.env)
  if (!parsed.success) {
    console.error('❌ Invalid server env:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid server environment variables')
  }
  return parsed.data
}
