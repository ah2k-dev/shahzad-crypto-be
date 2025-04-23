import mongoose, { Model } from 'mongoose';
import { IProduct } from '../../types/models/product';

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true
    },
    commissionPercentage: {
      type: Number,
      required: [true, 'Commission percentage is required'],
      min: [0, 'Commission percentage cannot be negative'],
      max: [100, 'Commission percentage cannot exceed 100']
    },
    commissionDays: {
      type: Number,
      required: [true, 'Commission days is required'],
      min: [0, 'Commission days cannot be negative']
    },
    brands: {
      type: [String],
      required: [true, 'At least one brand is required'],
      validate: {
        validator: function(brands: string[]) {
          return brands.length > 0;
        },
        message: 'At least one brand is required'
      }
    },
    image: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product; 