import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';

export const links = pgTable('links', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  originalLink: varchar('original_link', { length: 2048 }).notNull(),
  shortLink: varchar('short_link', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
