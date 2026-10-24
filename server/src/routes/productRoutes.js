import { Router } from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, requirePerm } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', requirePerm('READ'), getProducts);
router.post('/', requirePerm('CREATE', 'Access Restriction: Your assigned role lacks permission to create inventory items.'), createProduct);
router.put('/:id', requirePerm('UPDATE', 'Access Restriction: Your assigned role lacks permission to update inventory items.'), updateProduct);
router.delete('/:id', requirePerm('DELETE', 'Access Restriction: Your assigned role lacks permission to delete inventory items.'), deleteProduct);

export default router;
