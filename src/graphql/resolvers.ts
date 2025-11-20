import { productService } from '../services/productService';

export const rootResolver = {
  products: () => productService.getProducts()
};
