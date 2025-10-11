import { pgTable, uuid, timestamp, serial } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { links } from './links';

export const visits = pgTable('visits', {
  id: uuid('id')
    .default(sql`uuid_generate_v7()`)
    .primaryKey(),
  linkId: uuid('link_id')
    .notNull()
    .references(() => links.id, { onDelete: 'cascade' }),
  acessedAt: timestamp('acessed_at', { withTimezone: true, mode: 'date' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
