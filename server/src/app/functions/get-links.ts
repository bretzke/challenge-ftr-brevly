import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { eq } from 'drizzle-orm';
import { LinkModel } from '../models/LinkModel';
import { AppError } from '@/shared/errors/AppError';
import { ErrorMessages } from '@/shared/errors/ErrorMessages';

interface GetLinkParams {
  shortLink: string;
}

export async function getLink({ shortLink }: GetLinkParams): Promise<LinkModel> {
  const fullShortLink = `brev.ly/${shortLink.toLowerCase()}`;

  const linksWithVisits = await db
    .select({
      id: schema.links.id,
      originalLink: schema.links.originalLink,
      shortLink: schema.links.shortLink,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .where(eq(schema.links.shortLink, fullShortLink))
    .limit(1);

  if (!linksWithVisits.length) {
    throw new AppError(ErrorMessages.SHORT_LINK_DOES_NOT_EXIST);
  }

  const selectedLink = linksWithVisits[0];

  await db.insert(schema.visits).values({
    linkId: selectedLink.id,
  });

  return selectedLink;
}
