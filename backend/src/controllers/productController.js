import { searchProducts } from '../services/productService.js';

export const search = async (req, res, next) => {
  try {
    const query = req.query.q || req.body.q || '';
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const products = await searchProducts(query);
    res.json({ query, products });
  } catch (error) {
    next(error);
  }
};
