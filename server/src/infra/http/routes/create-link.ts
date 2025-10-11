import type { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const createLinkBodySchema = z.object({
  originalUrl: z
    .url('O campo "originalUrl" deve ser uma URL válida')
    .max(2048, 'O campo "originalUrl" não pode exceder 2048 carácteres'),
  shortUrl: z
    .string()
    .refine((url) => url.startsWith('brev.ly/'), 'O campo "shortLink" deve começar com "brev.ly/".')
    .max(255, 'o campo "shortLink" não pode exceder 255 carácteres.'),
});

type CreateLinkBody = z.input<typeof createLinkBodySchema>;

export const createLinkRoute: FastifyPluginAsyncZod = async (server: FastifyInstance) => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a shortned link',
        tags: ['Links'],
        response: {
          201: z.null().describe('Link created'),
        },
        body: createLinkBodySchema,
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body as CreateLinkBody;
      return reply.status(201).send();
    }
  );
};
