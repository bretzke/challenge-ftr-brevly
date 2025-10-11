import { getLink } from '@/app/functions/get-links';
import type { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const getLinkParamsSchema = z.object({
  shortLink: z.string().min(1, 'O shortLink é obrigatório.'),
});
type GetLinkParams = z.infer<typeof getLinkParamsSchema>;

export const GetLinkRoute: FastifyPluginAsyncZod = async (server: FastifyInstance) => {
  server.get(
    '/links/:shortLink',
    {
      schema: {
        summary: 'Get Link',
        tags: ['Links'],
        params: getLinkParamsSchema,
        response: {
          200: z.object({
            id: z.string(),
            originalLink: z.string(),
            shortLink: z.string(),
            createdAt: z.date(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { shortLink } = request.params as GetLinkParams;

      const link = await getLink({ shortLink });

      return reply.status(200).send(link);
    }
  );
};
