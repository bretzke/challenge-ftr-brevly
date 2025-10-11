import { db, pg } from '@/infra/db';
import { schema } from '@/infra/db/schemas';
import { sql as drizzleSql, count, desc } from 'drizzle-orm';
import { PassThrough, Transform } from 'stream';
import { pipeline } from 'stream/promises';
import { stringify } from 'csv-stringify';
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage';

interface ExportLinksResponse {
  exportUrl: string;
}

export async function exportLinks(): Promise<ExportLinksResponse> {
  const { sql, params } = db
    .select({
      id: schema.links.id,
      originalLink: schema.links.originalLink,
      shortLink: schema.links.shortLink,
      totalVisits: count(schema.visits.id).as('total_visits'),
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .leftJoin(schema.visits, drizzleSql`${schema.visits.linkId} = ${schema.links.id}`)
    .groupBy(schema.links.id)
    .orderBy(desc(schema.links.createdAt))
    .toSQL();

  const cursor = pg.unsafe(sql, params as string[]).cursor(2);

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'original_link', header: 'Link original' },
      { key: 'short_link', header: 'Link encurtado' },
      { key: 'total_visits', header: 'Total de acessos' },
      { key: 'created_at', header: 'Criado em' },
    ],
  });

  const uploadCsvToStorageStream = new PassThrough();

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], enconding, callback) {
        for (const chunk of chunks) {
          this.push(chunk);
        }

        callback();
      },
    }),
    csv,
    uploadCsvToStorageStream
  );

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    fileName: `${new Date()}-brevly-uploads.csv`,
    contentStream: uploadCsvToStorageStream,
  });

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]);

  return { exportUrl: url };
}
