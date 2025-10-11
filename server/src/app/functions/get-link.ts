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
  const fullShortLink = `brev.ly/${shortLink}`;

  const selectedLink = await db.query.links.findFirst({
    columns: { id: true, createdAt: true, originalLink: true, shortLink: true },
    where: eq(schema.links.shortLink, fullShortLink),
  });

  if (!selectedLink) {
    throw new AppError(ErrorMessages.SHORT_LINK_DOES_NOT_EXIST);
  }

  await db.insert(schema.visits).values({
    linkId: selectedLink.id,
  });

  return selectedLink;
}
