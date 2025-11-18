"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProductImage } from "@/app/dashboard/types/product";

interface ProductType {
  _id?: string;
  product_id?: number;
  category_id?: number;
  productName: string;
  regularPrice?: number | null;
  salePrice?: number | null;
  description?: string;
  has_variants?: boolean | number;
  productImages?: ProductImage[];
  image?: string;
  [key: string]: any;
}

interface ProductContextType {
  selectedProduct: ProductType | null;
  setSelectedProduct: (product: ProductType | null) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  return (
    <ProductContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
