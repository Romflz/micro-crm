import { z } from 'zod'

export const clientSchema = z.object({
  VITE_TEST__KEY: z.string(),
})

export type ClientEnv = z.infer<typeof clientSchema>
