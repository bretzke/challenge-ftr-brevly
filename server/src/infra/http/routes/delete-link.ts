import { deleteLink } from '@/app/functions/delete-link';
import { getLink } from '@/app/functions/get-link';
import type { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const getLinkParamsSchema = z.object({
  shortLink: z.string().min(1, 'O shortLink é obrigatório.'),
});
type GetLinkParams = z.infer<typeof getLinkParamsSchema>;

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server: FastifyInstance) => {
  server.delete(
    '/links/:shortLink',
    {
      schema: {
        summary: 'Delete Link',
        tags: ['Links'],
        params: getLinkParamsSchema,
        response: {
          204: z.null().describe('Link deleted.'),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortLink } = request.params as GetLinkParams;

      await deleteLink({ shortLink });

      return reply.status(204).send();
    }
  );
};
