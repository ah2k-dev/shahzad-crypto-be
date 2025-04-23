import express, { Router } from 'express';
import auth from './auth.routes';
import products from './product.routes';

const router: Router = express.Router();

router.use('/auth', auth);
router.use('/products', products);

export default router;
