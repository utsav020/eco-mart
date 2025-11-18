"use client";

import React from "react";
import { X, Package, Tag, Scale, Info, ImageIcon, Layers } from "lucide-react";

interface VariantImage {
  image_id: number;
  image_url: string;
}

interface Variant {
  product_variant_id: number;
  productVariantName: string;
  regularPrice: string;
  salePrice: string;
  weights: string;
  quantity: number;
  is_default: number;
  images?: VariantImage[];
}

interface ProductImage {
  image_id: number;
  image_url: string;
}

interface Product {
  product_id: number;
  category_id: number;
  productName: string;
  regularPrice: string | null;
  salePrice: string | null;
  weights: string | null;
  quantity: string | number | null;
  description: string;
  has_variants: number;
  images?: ProductImage[];
  variants?: Variant[];
}

interface Props {
  product: Product | null;
  onClose: () => void;
}

const ProductViewModal: React.FC<Props> = ({ product, onClose }) => {
  if (!product) return null;

  const formatPrice = (price: string | null) => {
    if (!price) return "-";
    return `₹${parseFloat(price).toLocaleString("en-IN")}`;
  };

  const hasDiscount = (regular: string | null, sale: string | null) => {
    if (!regular || !sale) return false;
    return parseFloat(regular) > parseFloat(sale);
  };

  const calculateDiscount = (regular: string, sale: string) => {
    const reg = parseFloat(regular);
    const sal = parseFloat(sale);
    return Math.round(((reg - sal) / reg) * 100);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return {
        text: "Out of Stock",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    if (quantity < 10)
      return {
        text: "Low Stock",
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
      };
    return {
      text: "In Stock",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-gray-200",
    };
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex transition-all duration-500 hover:shadow-md hover:scale-[1.02] justify-center items-center z-50 p-4 ease-in-out">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative bg-emerald-100 p-8 text-black">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-black p-3 rounded-2xl transition-all duration-300 transform hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-green-400 text-white p-3 rounded-2xl backdrop-blur-sm">
              <Package size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{product.productName}</h2>
              <div className="flex items-center space-x-4 text-black">
                <span className="px-3 py-1 rounded-full text-[14px] font-medium bg-emerald-50">
                  ID: #{product.product_id}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-white text-[12px] font-medium backdrop-blur-sm ${
                    product.has_variants ? "bg-green-500" : "bg-blue-500"
                  }`}
                >
                  {product.has_variants ? "With Variants" : "Single Product"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-8">
          {/* Product Images Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <ImageIcon size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Product Gallery
                </h3>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {product.images.length} images
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <div key={img.image_id} className="relative group">
                    <img
                      src={img.image_url}
                      alt={product.productName}
                      className="w-full h-24 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 font-medium text-sm">
                        View {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Information Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Tag size={20} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800">
                  Pricing Information
                </h4>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-gray-600 font-medium">
                    Regular Price
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    {formatPrice(product.regularPrice)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-blue-100">
                  <span className="text-gray-600 font-medium">Sale Price</span>
                  <span
                    className={`text-xl font-bold ${
                      hasDiscount(product.regularPrice, product.salePrice)
                        ? "text-green-600"
                        : "text-gray-800"
                    }`}
                  >
                    {formatPrice(product.salePrice)}
                  </span>
                </div>

                {hasDiscount(product.regularPrice, product.salePrice) &&
                  product.regularPrice &&
                  product.salePrice && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                      <span className="text-red-600 font-bold text-[16px]">
                        Save{" "}
                        {calculateDiscount(
                          product.regularPrice,
                          product.salePrice
                        )}
                        %
                      </span>
                      <div className="text-red-500 text-md mt-1">
                        You save ₹
                        {(
                          parseFloat(product.regularPrice) -
                          parseFloat(product.salePrice)
                        ).toLocaleString("en-IN")}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Stock & Details Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="flex space-x-3 h-[70px] mb-4">
                <div className="bg-green-500 p-2 h-[30px] rounded-lg">
                  <Package size={20} className="text-white" />
                </div>
                <div className="pt-2">
                  <h4 className="text-xl font-semibold text-gray-800">
                    Stock & Details
                  </h4>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-green-100">
                  <span className="text-gray-600 font-medium">Quantity</span>
                  <div className="text-right">
                    <span
                      className={`text-[14px] font-bold ${
                        getStockStatus(parseInt(product.quantity as string))
                          .color
                      }`}
                    >
                      {product.quantity ?? 0}
                    </span>
                    <div
                      className={`text-[14px] ${
                        getStockStatus(parseInt(product.quantity as string))
                          .color
                      } font-medium`}
                    >
                      {
                        getStockStatus(parseInt(product.quantity as string))
                          .text
                      }
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-green-100">
                  <span className="text-gray-600 font-medium flex items-center space-x-2">
                    <Scale size={16} />
                    <span>Weight</span>
                  </span>
                  <span className="font-semibold text-gray-800">
                    {product.weights || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Category ID</span>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full font-medium text-[14px]">
                    #{product.category_id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-emerald-50 hover:border-green-400 border-2 rounded-2xl p-6 border-purple-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Info size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Product Description
              </h3>
            </div>
            <div className="bg-white/50 rounded-xl p-4 border border-purple-200">
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>
          </div>

          {/* Variants Section */}
          {product.has_variants && product.variants && (
            <div className="rounded-2xl p-6 border border-orange-100">
              <div className="flex space-x-3 h-[50px] mb-6">
                <div className="bg-orange-500 mt-[10px] h-[30px] p-2 rounded-lg">
                  <Layers size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Product Variants
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {product.variants.length} variants available
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {product.variants.map((variant, idx) => {
                  const variantStockStatus = getStockStatus(variant.quantity);
                  return (
                    <div
                      key={variant.product_variant_id}
                      className="bg-white rounded-xl hover:border-green-500 p-5 border-2"
                    >
                      <div className="flex w-full flex-col lg:flex-row justify-between mb-4">
                        <div className="flex w-full items-center space-x-4 mb-3 lg:mb-0">
                          <div className="flex w-full items-center justify-between">
                            <div className="flex gap-3 w-auto">
                              <div className="bg-green-500 mt-2 text-white w-9 h-8.5 rounded-full flex items-center justify-center font-bold">
                                {idx + 1}
                              </div>
                              <div className="w-auto font-bold p-2 rounded-lg">
                                <h5 className="">{variant.productVariantName}</h5>
                              </div>
                            </div>

                            <div className="flex w-auto items-center justify-center ">
                                <span
                                  className={`${variantStockStatus.bg} ${variantStockStatus.color} px-2 py-1 rounded-full text-[13px] ${variantStockStatus.border} font-medium`}
                                >
                                  {variantStockStatus.text}
                                </span>
                              </div>
                          </div>
                        </div>
                      </div>

                      {/* Variant Images */}
                      {variant.images && variant.images.length > 0 && (
                        <div className="mb-4">
                          <div className="flex space-x-2 overflow-x-auto pb-2">
                            {variant.images.map((img) => (
                              <img
                                key={img.image_id}
                                src={img.image_url}
                                alt={variant.productVariantName}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:border-orange-500 transition-all duration-300"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[14px]">
                        <div className="text-center bg-gray-50 rounded-lg p-3">
                          <div className="text-gray-500 font-medium">
                            Regular
                          </div>
                          <div className="font-bold text-gray-800">
                            {formatPrice(variant.regularPrice)}
                          </div>
                        </div>
                        <div className="text-center bg-green-50 rounded-lg p-3">
                          <div className="text-gray-500 font-medium">Sale</div>
                          <div className="font-bold text-green-600">
                            {formatPrice(variant.salePrice)}
                          </div>
                        </div>
                        <div className="text-center bg-blue-50 rounded-lg p-3">
                          <div className="text-gray-500 font-medium">
                            Weight
                          </div>
                          <div className="font-bold text-gray-800">
                            {variant.weights}
                          </div>
                        </div>
                        <div className="text-center bg-red-50 rounded-lg p-3">
                          <div className="text-gray-500 font-medium">Stock</div>
                          <div
                            className={`font-bold ${
                              variant.quantity > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {variant.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
