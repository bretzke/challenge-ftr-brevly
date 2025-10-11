import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { sql, count, desc } from 'drizzle-orm';
import { LinkWithVisitModel } from '../models/LinkModel';

export async function listLinks(): Promise<LinkWithVisitModel[]> {
  const linksWithVisits = await db
    .select({
      id: schema.links.id,
      originalLink: schema.links.originalLink,
      shortLink: schema.links.shortLink,
      createdAt: schema.links.createdAt,
      totalVisits: count(schema.visits.id).as('total_visits'),
    })
    .from(schema.links)
    .leftJoin(schema.visits, sql`${schema.visits.linkId} = ${schema.links.id}`)
    .groupBy(schema.links.id)
    .orderBy(desc(schema.links.createdAt));

  return linksWithVisits;
}
