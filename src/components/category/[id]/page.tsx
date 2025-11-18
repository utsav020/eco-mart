"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface Product {
  product_id: number;
  productName: string;
  regularPrice: string;
  salePrice: string;
  image_url?: string;
}

const CategoryProductsPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      const fetchProducts = async () => {
        try {
          const res = await axios.get(
            `https://ekomart-backend.onrender.com/api/product/getproductbycategory/${id}`
          );
          setProducts(res.data.products || []);
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      };
      fetchProducts();
    }
  }, [id]);

  return (
    <div className="max-w-[1720px] mx-auto mt-[100px]">
      <h2 className="text-[35px] font-bold mb-6">
        Category ID: {id} Products
      </h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={
                  product.image_url
                    ? product.image_url
                    : "/assets/images/default-product.png"
                }
                alt={product.productName}
                className="w-full h-[250px] object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {product.productName}
                </h3>
                <p className="text-gray-600">
                  ₹{product.salePrice || product.regularPrice || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">
          No products found for this category.
        </p>
      )}
    </div>
  );
};

export default CategoryProductsPage;
