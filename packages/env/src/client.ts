import { z } from 'zod'

export const clientSchema = z.object({})

export type ClientEnv = z.infer<typeof clientSchema>
