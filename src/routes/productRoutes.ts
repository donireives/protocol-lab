import { Router } from 'express';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productController';

const productRouter = Router();

productRouter.get('/product', getProducts);
productRouter.post('/product', createProduct);
productRouter.put('/product', updateProduct);
productRouter.delete('/product', deleteProduct);

export default productRouter;
