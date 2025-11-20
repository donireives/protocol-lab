import { Request, Response } from 'express';
import { productService } from '../services/productService';

export const getProducts = (_req: Request, res: Response): void => {
  res.json(productService.getProducts());
};

export const createProduct = (req: Request, res: Response): void => {
  const result = productService.createProduct(req.body);
  res.status(201).json(result);
};

export const updateProduct = (req: Request, res: Response): void => {
  const result = productService.updateProduct(req.body);
  res.json(result);
};

export const deleteProduct = (_req: Request, res: Response): void => {
  const result = productService.deleteProduct();
  res.json(result);
};
