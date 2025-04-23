import express, { Router } from 'express';
import * as product from '../controllers/product.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import * as schema from '../validations/product.schema';
import upload from '../utils/multerConfig';

const router: Router = express.Router();

// GET routes
router.route('/')
  .get(validate(schema.getProducts, 'query'), product.getAllProducts);

router.route('/:productId')
  .get(validate(schema.productId, 'params'), product.getProduct);

// POST routes
router.route('/')
  .post(
    isAuthenticated,
    isAdmin,
    upload.single('image'),
    validate(schema.createProduct),
    product.createProduct
  );

// PUT routes
router.route('/:productId')
  .put(
    isAuthenticated,
    isAdmin,
    upload.single('image'),
    validate(schema.productId, 'params'),
    validate(schema.updateProduct),
    product.updateProduct
  );

// DELETE routes
router.route('/:productId')
  .delete(
    isAuthenticated,
    isAdmin,
    validate(schema.productId, 'params'),
    product.deleteProduct
  );

export default router; 