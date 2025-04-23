import { RequestHandler } from 'express';
import Product from '../models/Product/product.model';
import { IProduct } from '../types/models/product';
import * as productTypes from '../types/controllers/product';
import SuccessHandler from '../utils/successHandler';
import ErrorHandler from '../utils/errorHandler';
import mongoose from 'mongoose';
import { deleteFile } from '../utils/multerConfig';
import fs from 'fs';
import path from 'path';

// Create a new product
const createProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['products']
  try {
    const {
      name,
      description,
      price,
      quantity,
      category,
      commissionPercentage,
      commissionDays,
      brands
    } = req.body as productTypes.CreateProductBody;

    // Handle image upload
    const image = req.file ? req.file.path.replace(/\\/g, '/') : '';

    const product: IProduct = await Product.create({
      name,
      description,
      price,
      quantity,
      category,
      commissionPercentage,
      commissionDays,
      brands,
      image
    });

    return SuccessHandler({
      data: product,
      statusCode: 201,
      res
    });
  } catch (error) {
    // Delete uploaded file if there was an error
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

// Get all products with filtering, search and pagination
const getAllProducts: RequestHandler = async (req, res) => {
  // #swagger.tags = ['products']
  try {
    const {
      page = '1',
      limit = '10',
      search,
      category,
      minPrice,
      maxPrice,
      brand
    } = req.query as productTypes.GetProductsQuery;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object
    const filter: any = {};

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Filter by multiple brands
    if (brand) {
      filter.brands = { $in: JSON.parse(brand) };
    }

    // Get filtered products
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNumber);

    return SuccessHandler({
      data: {
        products,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalProducts,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1
        }
      },
      statusCode: 200,
      res
    });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

// Get a single product by ID
const getProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['products']
  try {
    const { productId } = req.params as unknown as productTypes.ProductIdParam;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return ErrorHandler({
        message: 'Invalid product ID',
        statusCode: 400,
        req,
        res
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return ErrorHandler({
        message: 'Product not found',
        statusCode: 404,
        req,
        res
      });
    }

    return SuccessHandler({
      data: product,
      statusCode: 200,
      res
    });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

// Update a product
const updateProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['products']
  try {
    const { productId } = req.params as unknown as productTypes.ProductIdParam;
    const updateData = req.body as productTypes.UpdateProductBody;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return ErrorHandler({
        message: 'Invalid product ID',
        statusCode: 400,
        req,
        res
      });
    }

    // Find the product first to get the current image
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      // Delete new uploaded file if product not found
      if (req.file) {
        deleteFile(req.file.path);
      }
      
      return ErrorHandler({
        message: 'Product not found',
        statusCode: 404,
        req,
        res
      });
    }

    // Handle image upload
    if (req.file) {
      // Add new image path to update data
      updateData.image = req.file.path.replace(/\\/g, '/');
      
      // Delete previous image if it exists
      if (existingProduct.image) {
        deleteFile(existingProduct.image);
      }
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return SuccessHandler({
      data: product,
      statusCode: 200,
      res
    });
  } catch (error) {
    // Delete uploaded file if there was an error
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

// Delete a product
const deleteProduct: RequestHandler = async (req, res) => {
  // #swagger.tags = ['products']
  try {
    const { productId } = req.params as unknown as productTypes.ProductIdParam;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return ErrorHandler({
        message: 'Invalid product ID',
        statusCode: 400,
        req,
        res
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return ErrorHandler({
        message: 'Product not found',
        statusCode: 404,
        req,
        res
      });
    }

    // Delete product image if it exists
    if (product.image) {
      deleteFile(product.image);
    }

    await Product.findByIdAndDelete(productId);

    return SuccessHandler({
      data: { message: 'Product deleted successfully' },
      statusCode: 200,
      res
    });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
}; 