import { StaticImport } from "next/dist/shared/lib/get-img-props";

// types/product.ts
export interface ProductImage {
  url: string | StaticImport;
  is_main: number;
  image_id: number;
  image_url: string;
}

export interface ProductVariant {
  product_variant_id: number;
  productVariantName: string;
  regularPrice: string;
  salePrice: string;
  weights: string;
  quantity: number;
  is_default: number;
  created_at: string;
  updated_at: string;
  variantImages: any[];
}

export interface Product {
  product_id: number;
  category_id: number;
  productName: string;
  regularPrice: string | null;
  salePrice: string | null;
  weights: string | null;
  quantity: number | null;
  description: string;
  has_variants: number;
  created_at: string;
  updated_at: string;
  productImages: ProductImage[];
  variants: ProductVariant[];
}

export interface Category {
  category_id: number;
  categoryName: string;
  // Add other category fields as needed
}

export interface UpdateProductRequest {
  category_id: number;
  productName: string;
  regularPrice: string | null;
  salePrice: string | null;
  weights: string | null;
  quantity: number | null;
  description: string;
  has_variants: number;
  variants?: ProductVariant[];
}