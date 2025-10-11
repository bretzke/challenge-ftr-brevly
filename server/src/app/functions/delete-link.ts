import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { eq } from 'drizzle-orm';
import { AppError } from '@/shared/errors/AppError';
import { ErrorMessages } from '@/shared/errors/ErrorMessages';

interface DeleteLinkParams {
  shortLink: string;
}

export async function deleteLink({ shortLink }: DeleteLinkParams): Promise<void> {
  const fullShortLink = `brev.ly/${shortLink}`;

  const linkExists = await db.query.links.findFirst({
    columns: { id: true },
    where: eq(schema.links.shortLink, fullShortLink),
  });

  if (!linkExists) {
    throw new AppError(ErrorMessages.SHORT_LINK_DOES_NOT_EXIST);
  }

  await db.delete(schema.links).where(eq(schema.links.id, linkExists.id));
}
