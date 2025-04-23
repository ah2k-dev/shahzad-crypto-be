import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  commissionPercentage: number;
  commissionDays: number;
  brands: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
} 