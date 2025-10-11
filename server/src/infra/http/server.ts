import { fastifyCors } from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { createLinkRoute } from './routes/create-link';
import { env } from '@/utils/env';
import { AppError } from '@/shared/errors/AppError';
import { listLinksRoute } from './routes/list-links';
import { getLinkRoute } from './routes/get-link';
import { deleteLinkRoute } from './routes/delete-link';
import { exportLinksRoute } from './routes/export-links';

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  console.error(error);

  return reply.status(500).send({ message: 'Erro inesperado. Tente mais tarde.' });
});

server.register(fastifyCors, { origin: '*' });

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brevly Server',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});
server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

server.register(createLinkRoute);
server.register(listLinksRoute);
server.register(getLinkRoute);
server.register(deleteLinkRoute);
server.register(exportLinksRoute);

server
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP Server running!');
  });
