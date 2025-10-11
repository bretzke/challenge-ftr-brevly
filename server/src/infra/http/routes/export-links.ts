import { exportLinks } from '@/app/functions/export-links';
import { listLinks } from '@/app/functions/list-links';
import type { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const exportLinksRoute: FastifyPluginAsyncZod = async (server: FastifyInstance) => {
  server.get(
    '/links/exports',
    {
      schema: {
        summary: 'Export links to a csv file',
        tags: ['Links'],
        response: {
          200: z.object({
            exportUrl: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { exportUrl } = await exportLinks();

      return reply.status(200).send({ exportUrl });
    }
  );
};
