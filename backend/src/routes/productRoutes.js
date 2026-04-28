import { Router } from 'express';
import { search } from '../controllers/productController.js';

const router = Router();

router.get('/search', search);
router.post('/search', search);

export default router;
