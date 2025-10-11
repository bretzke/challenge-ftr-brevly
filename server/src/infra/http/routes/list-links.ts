import { listLinks } from '@/app/functions/list-links';
import type { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const listLinksRoute: FastifyPluginAsyncZod = async (server: FastifyInstance) => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'List links',
        tags: ['Links'],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              originalLink: z.string(),
              shortLink: z.string(),
              createdAt: z.date(),
              totalVisits: z.number(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const links = await listLinks();

      return reply.status(200).send(links);
    }
  );
};
