export interface CreateProductBody {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  commissionPercentage: number;
  commissionDays: number;
  brands: string[];
  image?: string;
}

export interface UpdateProductBody {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  category?: string;
  commissionPercentage?: number;
  commissionDays?: number;
  brands?: string[];
  image?: string;
}

export interface GetProductsQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
}

export interface ProductIdParam {
  productId: string;
} 