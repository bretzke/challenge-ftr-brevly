import { db } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { AppError } from '@/shared/errors/AppError';
import { ErrorMessages } from '@/shared/errors/ErrorMessages';
import { eq } from 'drizzle-orm';

const STRICT_URL_REGEX = /^(https?:\/\/)([a-z0-9-]+\.)+[a-z]{2,}\/([a-z0-9-]+)$/i;

interface CreateLinkParams {
  originalLink: string;
  shortLink: string;
}

export async function createLink({ originalLink, shortLink }: CreateLinkParams): Promise<void> {
  if (!STRICT_URL_REGEX.test(`http://${shortLink}`)) {
    throw new AppError(ErrorMessages.INVALID_SHORT_LINK_FORMAT);
  }

  const result = await db
    .select({ id: schema.links.id })
    .from(schema.links)
    .where(eq(schema.links.shortLink, shortLink))
    .limit(1);

  if (result.length > 0) {
    throw new AppError(ErrorMessages.SHORT_LINK_ALREADY_EXISTS);
  }

  await db.insert(schema.links).values({
    originalLink,
    shortLink,
  });
}
