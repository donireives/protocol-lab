import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { mcpServer } from './productServer';

const transport = new StdioServerTransport();

mcpServer.connect(transport).catch(error => {
  console.error('Failed to start MCP server via stdio', error);
  process.exit(1);
});
