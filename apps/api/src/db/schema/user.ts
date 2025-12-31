import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export default pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  age: integer().notNull(),
  email: varchar().notNull().unique(),
})
