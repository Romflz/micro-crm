import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'

export default pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  age: integer().notNull(),
  email: varchar().notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})
