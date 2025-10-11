import { randomUUID } from 'node:crypto';
import { basename, extname } from 'node:path';
import { Readable } from 'node:stream';
import { URL } from 'node:url';
import { Upload } from '@aws-sdk/lib-storage';
import { z } from 'zod';
import { r2 } from './client';
import { env } from '@/utils/env';

const uploadFileToStorageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

const STORAGE_FOLDER = 'downloads';

type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput>;

export async function uploadFileToStorage(input: UploadFileToStorageInput) {
  const { fileName, contentStream, contentType } = uploadFileToStorageInput.parse(input);

  const uniqueFileName = `${STORAGE_FOLDER}/${randomUUID()}-${sanitizeFilename(fileName)}`;

  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType,
    },
  });

  await upload.done();

  return {
    key: uniqueFileName,
    url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString(),
  };
}

const sanitizeFilename = (fileName: string) => {
  const fileExtension = extname(fileName);
  const fileNameWithoutExtension = basename(fileName);
  const sanitizedFilename = fileNameWithoutExtension.replace(/[^a-zA-Z0-9]/g, '');
  return sanitizedFilename.concat(fileExtension);
};
