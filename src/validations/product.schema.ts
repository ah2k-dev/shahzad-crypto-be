import Joi from 'joi';
import { validateParsedJSON } from '../utils/joiExtensions';
const createProduct = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).required(),
  category: Joi.string().required(),
  commissionPercentage: Joi.number().min(0).max(100).required(),
  commissionDays: Joi.number().min(0).required(),
  brands: validateParsedJSON('array', Joi.array().items(Joi.string())),
  // Image is handled by multer middleware
});

const updateProduct = Joi.object({
  name: Joi.string().min(3),
  description: Joi.string().min(10),
  price: Joi.number().min(0),
  quantity: Joi.number().min(0),
  category: Joi.string(),
  commissionPercentage: Joi.number().min(0).max(100),
  commissionDays: Joi.number().min(0),
  brands: validateParsedJSON('array', Joi.array().items(Joi.string())),
  // Image is handled by multer middleware
}).min(1);

const getProducts = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  search: Joi.string(),
  category: Joi.string(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  brand: Joi.string()
});

const productId = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid product ID format'
  })
});

export {
  createProduct,
  updateProduct,
  getProducts,
  productId
}; 