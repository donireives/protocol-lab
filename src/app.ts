import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import apiRouter from './routes';
import { apiKeyMiddleware } from './middleware/apiKeyMiddleware';
import { schema } from './graphql/schema';
import { rootResolver } from './graphql/resolvers';
import { mcpServer } from './mcp/productServer';

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
    rootValue: rootResolver
  })
);

app.all('/mcp', apiKeyMiddleware, async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  res.on('close', () => {
    void transport.close();
  });

  try {
    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('MCP HTTP transport error', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'MCP_HTTP_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    pathTried: req.path
  });
});

export default app;
