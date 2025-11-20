import productData from '../data/dummy_product.json';
import { Product } from '../types/product';

export interface ProductResponse {
  products: Product[];
  message: string;
  acceptedPayload?: unknown;
}

class ProductService {
  private readonly products: Product[];

  constructor() {
    this.products = productData;
  }

  getProducts(): Product[] {
    return this.products;
  }

  createProduct(payload: unknown): ProductResponse {
    return {
      products: this.products,
      acceptedPayload: payload,
      message: 'Simulated create operation completed. Data persisted only in memory.'
    };
  }

  updateProduct(payload: unknown): ProductResponse {
    return {
      products: this.products,
      acceptedPayload: payload,
      message: 'Simulated update executed. Persistent layer remains unchanged.'
    };
  }

  deleteProduct(): ProductResponse {
    return {
      products: this.products,
      message: 'Simulated delete executed. Source data is immutable for demo purposes.'
    };
  }
}

export const productService = new ProductService();
