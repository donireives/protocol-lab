import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type Product {
    id: String!
    name: String!
    description: String!
    price: Float!
    active: Boolean!
  }

  type Query {
    products: [Product!]!
  }
`);
