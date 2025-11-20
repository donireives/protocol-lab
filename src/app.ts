import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import apiRouter from './routes';
import { apiKeyMiddleware } from './middleware/apiKeyMiddleware';
import { schema } from './graphql/schema';
import { rootResolver } from './graphql/resolvers';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'protocol-lab' });
});

app.use('/api', apiKeyMiddleware, apiRouter);

app.use(
  '/api/graphql',
  apiKeyMiddleware,
  createHandler({
    schema,
    rootValue: rootResolver,
    graphiql: process.env.NODE_ENV !== 'production'
  })
);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    pathTried: req.path
  });
});

export default app;
