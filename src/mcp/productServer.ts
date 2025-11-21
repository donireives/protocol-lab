import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import productData from '../data/dummy_product.json';
import topSellerRaw from '../data/top_seller_insight.json';
import { Product } from '../types/product';
import { TopSellerInsight } from '../types/topSeller';

const products: Product[] = productData;
const topSellerInsight: TopSellerInsight = topSellerRaw;

const productRecordShape = {
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  active: z.boolean()
} satisfies z.ZodRawShape;

const productRecordSchema = z.object(productRecordShape).strict();

const getProductsInputShape = {
  onlyActive: z
    .boolean()
    .optional()
    .describe('Set true to only receive products that are currently active.'),
  maxPrice: z
    .number()
    .optional()
    .describe('Return products equal or cheaper than this price in USD.'),
  limit: z
    .number()
    .int()
    .positive()
    .max(products.length)
    .optional()
    .describe('Trim the response to the first N products after filtering.')
} satisfies z.ZodRawShape;

const getProductsInputSchema = z.object(getProductsInputShape).strict();

const getProductsOutputShape = {
  total: z.number(),
  appliedFilters: z.object({
    onlyActive: z.boolean(),
    maxPrice: z.number().nullable(),
    limit: z.number().nullable()
  }),
  products: z.array(productRecordSchema)
} satisfies z.ZodRawShape;

const getProductsOutputSchema = z.object(getProductsOutputShape).strict();

const topSellerInputShape = {
  includeProductDetail: z
    .boolean()
    .optional()
    .describe('When true, the tool enriches the insight with the full product object.')
} satisfies z.ZodRawShape;

const topSellerInputSchema = z.object(topSellerInputShape).strict();

const topSellerOutputShape = {
  period: z.string(),
  generatedAt: z.string(),
  topSeller: z.object({
    productId: z.string(),
    productName: z.string(),
    unitsSold: z.number(),
    revenue: z.number(),
    averageOrderValue: z.number(),
    growthRatePct: z.number(),
    channelMix: z.object({
      marketplace: z.number(),
      distribution: z.number(),
      retail: z.number()
    })
  }),
  customerSignals: z.array(z.string()),
  regionalBreakdown: z.array(
    z.object({
      region: z.string(),
      percentage: z.number()
    })
  ),
  nextActions: z.array(z.string()),
  productDetail: productRecordSchema.optional()
} satisfies z.ZodRawShape;

const topSellerOutputSchema = z.object(topSellerOutputShape).strict();

type GetProductsArgs = z.infer<typeof getProductsInputSchema>;
type TopSellerArgs = z.infer<typeof topSellerInputSchema>;

export const mcpServer = new McpServer({
  name: 'protocol-lab-mcp',
  version: '1.0.0'
});

mcpServer.registerTool(
  'getProducts',
  {
    title: 'Get product catalog',
    description:
      'Returns the current dummy product catalog. Optional filters can limit the response for specific use cases.',
    inputSchema: getProductsInputSchema as unknown as z.ZodType<object>,
    outputSchema: getProductsOutputSchema as unknown as z.ZodType<object>
  },
  async ({ onlyActive, maxPrice, limit }: GetProductsArgs) => {
    let filtered = products;

    if (onlyActive) {
      filtered = filtered.filter(product => product.active);
    }

    if (typeof maxPrice === 'number') {
      filtered = filtered.filter(product => product.price <= maxPrice);
    }

    if (typeof limit === 'number') {
      filtered = filtered.slice(0, limit);
    }

    const output = {
      total: filtered.length,
      appliedFilters: {
        onlyActive: Boolean(onlyActive),
        maxPrice: typeof maxPrice === 'number' ? maxPrice : null,
        limit: typeof limit === 'number' ? limit : null
      },
      products: filtered
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(output, null, 2)
        }
      ],
      structuredContent: output
    };
  }
);

mcpServer.registerTool(
  'getTopSellerInsight',
  {
    title: 'Get best seller insight',
    description:
      'Shares dummy telemetry describing which product sold the most for the current business period.',
    inputSchema: topSellerInputSchema as unknown as z.ZodType<object>,
    outputSchema: topSellerOutputSchema as unknown as z.ZodType<object>
  },
  async ({ includeProductDetail }: TopSellerArgs) => {
    const productDetail = products.find(product => product.id === topSellerInsight.topSeller.productId);

    const output = {
      ...topSellerInsight,
      productDetail: includeProductDetail ? productDetail : undefined
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(output, null, 2)
        }
      ],
      structuredContent: output
    };
  }
);

export default mcpServer;
