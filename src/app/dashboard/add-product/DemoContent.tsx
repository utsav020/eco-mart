"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Package,
  Tag,
  DollarSign,
  Scale,
  Hash,
  FileText,
  AlertCircle,
} from "lucide-react";

const AddProductPage = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<
    { category_id: number; categoryName: string }[]
  >([]);

  const [formData, setFormData] = useState({
    category_id: "",
    productName: "",
    description: "",
    has_variants: false,
    regularPrice: "",
    salePrice: "",
    weights: "",
    quantity: "",
    productImage: null as File | null,
    variants: [
      {
        productVariantName: "",
        regularPrice: "",
        salePrice: "",
        weights: "",
        quantity: "",
        is_default: true,
        image: null as File | null,
      },
    ],
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/categories/getallcategory`
        );
        setCategories(res.data?.categories || res.data || []);
      } catch {
        setErrorMsg("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Input handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Variant handler
  const handleVariantChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updated = [...formData.variants];
    (updated[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, variants: updated }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          productVariantName: "",
          regularPrice: "",
          salePrice: "",
          weights: "",
          quantity: "",
          is_default: false,
          image: null as File | null,
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      const updated = formData.variants.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, variants: updated }));
    }
  };

  // Submit
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setErrorMsg(null);
  //   setIsSubmitting(true);

  //   try {
  //     const fd = new FormData();

  //     // ✅ Product fields
  //     fd.append("category_id", String(formData.category_id));
  //     fd.append("productName", formData.productName);
  //     fd.append("description", formData.description);
  //     fd.append("has_variants", formData.has_variants ? "1" : "0");

  //     // ✅ Product image
  //     if (formData.productImage) {
  //       fd.append("productImage", formData.productImage);
  //     }

  //     // ✅ Simple product
  //     if (!formData.has_variants) {
  //       fd.append("regularPrice", String(formData.regularPrice));
  //       fd.append("salePrice", String(formData.salePrice));
  //       fd.append("weights", formData.weights);
  //       fd.append("quantity", String(formData.quantity));
  //       fd.append("variants", "[]");
  //     }

  //     // ✅ Variants
  //     if (formData.has_variants) {
  //       const variantsPayload = formData.variants.map((v, index) => {
  //         // append variant image separately
  //         if (v.image) {
  //           fd.append(`variantImages[${index}]`, v.image);
  //         }

  //         return {
  //           productVariantName: v.productVariantName,
  //           regularPrice: Number(v.regularPrice),
  //           salePrice: Number(v.salePrice),
  //           weights: v.weights,
  //           quantity: Number(v.quantity),
  //           is_default: v.is_default ? 1 : 0,
  //         };
  //       });

  //       fd.append("variants", JSON.stringify(variantsPayload));
  //     }

  //     await axios.post(`${API_BASE_URL}/api/product/addproduct`, fd, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     router.push("/dashboard/product-list");
  //   } catch (err: any) {
  //     setErrorMsg(err.response?.data?.error || "Failed to submit product");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg(null);
  setIsSubmitting(true);

  try {
    const fd = new FormData();

    fd.append("category_id", String(formData.category_id));
    fd.append("productName", formData.productName);
    fd.append("description", formData.description);
    fd.append("has_variants", formData.has_variants ? "1" : "0");

    if (formData.productImage) {
      fd.append("productImage", formData.productImage);
    }

    /* ---------------- SIMPLE PRODUCT ---------------- */
    if (!formData.has_variants) {
      fd.append("regularPrice", String(formData.regularPrice));
      fd.append("salePrice", String(formData.salePrice || 0));
      fd.append("weights", formData.weights);
      fd.append("quantity", String(formData.quantity));
      fd.append("variants", "[]");
    }

    /* ---------------- VARIANT PRODUCT ---------------- */
    if (formData.has_variants) {
      // 🔥 get default variant
      const defaultVariant =
        formData.variants.find((v) => v.is_default) ||
        formData.variants[0];

      // ✅ SET MAIN PRODUCT VALUES (THIS FIXES NULL ISSUE)
      fd.append("regularPrice", String(defaultVariant.regularPrice));
      fd.append("salePrice", String(defaultVariant.salePrice || 0));
      fd.append("weights", defaultVariant.weights);
      fd.append("quantity", String(defaultVariant.quantity));

      const variantsPayload = formData.variants.map((v, index) => {
        if (v.image) {
          fd.append(`variantImages[${index}]`, v.image);
        }

        return {
          productVariantName: v.productVariantName,
          regularPrice: Number(v.regularPrice),
          salePrice: Number(v.salePrice || 0),
          weights: v.weights,
          quantity: Number(v.quantity),
          is_default: v.is_default ? 1 : 0,
        };
      });

      fd.append("variants", JSON.stringify(variantsPayload));
    }

    await axios.post(`${API_BASE_URL}/api/product/addproduct`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    router.push("/dashboard/product-list");
  } catch (err: any) {
    setErrorMsg(err.response?.data?.error || "Failed to submit product");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-6">
      <div className="max-w-[1920px] w-full mx-auto px-8">
        {/* Header */}
        <div className="mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-[16px] text-gray-600 hover:text-gray-900 mb-4 group"
            >
              <ArrowLeft className="w-10 h-10 mr-2 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Add New Product
              </h3>
              <p className="text-gray-500 mt-1">
                Fill in the details below to add a new product to your catalog
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    formData.has_variants ? "bg-blue-600" : "bg-green-600"
                  }`}
                ></div>
                <span className="text-[16px] font-medium">
                  {formData.has_variants ? "Variant Mode" : "Simple Product"}
                </span>
              </div>

              <div className="text-[16px]">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      has_variants: !prev.has_variants,
                      variants: prev.has_variants
                        ? []
                        : [
                            {
                              productVariantName: "",
                              regularPrice: "",
                              salePrice: "",
                              weights: "",
                              quantity: "",
                              is_default: true,
                              image: null as File | null,
                            },
                          ],
                    }))
                  }
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    formData.has_variants
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {formData.has_variants ? "Remove Variants" : "Add Variants"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <p className="text-red-700 text-[14px]">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
              <Package className="w-10 h-10 text-blue-600" />
              Basic Information
            </h2>

            <div className="">
              {/* Product Name */}
              <div className="space-y-2">
                <label className="block text-[14px] font-medium text-gray-700">
                  Product Name *
                </label>
                <div className="flex items-center gap-6 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                  <div className=" pl-3 flex items-center pointer-events-none">
                    <Tag className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="w-full">
                    <input
                      id="productName"
                      required
                      value={formData.productName}
                      onChange={handleInputChange}
                      className="w-full "
                      placeholder="Enter product name"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-[14px] font-medium text-gray-700">
                  Category *
                </label>
                <div className="flex items-center gap-6 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none">
                  <div className="flex items-center pointer-events-none">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <select
                    id="category_id"
                    required
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full "
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-[14px] font-medium text-gray-700">
                  Description
                </label>
                <div className="flex w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none">
                  <div className="pointer-events-none pt-1">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="w-full">
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full"
                      placeholder="Describe your product (features, benefits, etc.)"
                    />
                  </div>
                </div>
              </div>

              {/* Regular Price */}
              <div className="space-y-2">
                <label className="block text-[14px] font-medium text-gray-700">
                  Regular Price *
                </label>
                <div className="flex w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none">
                  <div className="flex items-center pointer-events-none">
                    <DollarSign className="h-8 w-8 text-gray-400" />
                  </div>
                  <input
                    id="regularPrice"
                    type="number"
                    required
                    value={formData.regularPrice}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="0"
                    step="10"
                    min="0"
                  />
                </div>
              </div>

              {/* Sale Price */}
              <div className="space-y-2">
                <label className="block text-[14px] font-medium text-gray-700">
                  Sale Price
                </label>
                <div className="flex w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none">
                  <div className="flex items-center pointer-events-none">
                    <Tag className="h-8 w-8 text-gray-400" />
                  </div>
                  <input
                    id="salePrice"
                    type="number"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label className="block text-[14px] font-medium text-gray-700">
                  Weight
                </label>
                <div className="flex w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none">
                  <div className="flex items-center pointer-events-none">
                    <Scale className="h-8 w-8 text-gray-400" />
                  </div>
                  <input
                    id="weights"
                    value={formData.weights}
                    onChange={handleInputChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="e.g., 500g, 1kg"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="block text-[14px] font-medium text-gray-700">
                  Stock Quantity *
                </label>
                <div className="flex w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none">
                  <div className="flex items-center pointer-events-none">
                    <Hash className="h-8 w-8 text-gray-400" />
                  </div>
                  <input
                    id="quantity"
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="0"
                    step="1"
                    min="0"
                  />
                </div>
              </div>

              {/* Product Image */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-[14px] font-medium text-gray-700">
                  Product Image *
                </label>
                <div className="flex w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        productImage: e.target.files?.[0] || null,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory Card */}
          {!formData.has_variants ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                <DollarSign className="w-10 h-10 text-green-600" />
                Pricing & Inventory
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Regular Price */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Regular Price *
                  </label>
                  <div className="flex">
                    <div className="flex items-center pointer-events-none">
                      <DollarSign className="h-8 w-8 text-gray-400" />
                    </div>
                    <input
                      id="regularPrice"
                      type="number"
                      required
                      value={formData.regularPrice}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="0"
                      step="10"
                      min="0"
                    />
                  </div>
                </div>

                {/* Sale Price */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Sale Price
                  </label>
                  <div className="flex">
                    <div className="flex items-center pointer-events-none">
                      <Tag className="h-8 w-8 text-gray-400" />
                    </div>
                    <input
                      id="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Weight
                  </label>
                  <div className="flex">
                    <div className="flex items-center pointer-events-none">
                      <Scale className="h-8 w-8 text-gray-400" />
                    </div>
                    <input
                      id="weights"
                      value={formData.weights}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="e.g., 500g, 1kg"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Stock Quantity *
                  </label>
                  <div className="flex">
                    <div className="flex items-center pointer-events-none">
                      <Hash className="h-8 w-8 text-gray-400" />
                    </div>
                    <input
                      id="quantity"
                      type="number"
                      required
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="0"
                      step="1"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Variants Card */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                <div className="">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                    <Package className="w-10 h-10 text-purple-600" />
                    Product Variants
                  </h2>
                </div>
                <div className="">
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variant
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-5">
                        <div className="w-8 h-8 mt-6 rounded-lg bg-blue-100 flex items-center justify-center">
                          <p className="text-blue-700 pt-0.5 font-medium">
                            {index + 1}
                          </p>
                        </div>
                        <div className="">
                          <h3 className="font-medium text-gray-900">
                            Variant {index + 1}
                            {variant.is_default && (
                              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                Default
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>

                      {formData.variants.length > 1 && (
                        <div className="">
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-10 h-10" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="space-y-2 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <label className="block text-[14px] font-medium text-gray-700">
                          Variant Name *
                        </label>
                        <input
                          value={variant.productVariantName}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "productVariantName",
                              e.target.value
                            )
                          }
                          required
                          className="w-full "
                          placeholder="e.g., Large, Blue"
                        />
                      </div>

                      <div className="space-y-2 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <label className="block text-[14px] font-medium text-gray-700">
                          Regular Price *
                        </label>
                        <div className="flex">
                          <div className="flex items-center pointer-events-none">
                            <DollarSign className="h-8 w-8 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            value={variant.regularPrice}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "regularPrice",
                                e.target.value
                              )
                            }
                            required
                            className="pl-5 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <label className="block text-[14px] font-medium text-gray-700">
                          Sale Price
                        </label>
                        <div className="flex">
                          <div className="flex items-center pointer-events-none">
                            <Tag className="h-8 w-8 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            value={variant.salePrice}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "salePrice",
                                e.target.value
                              )
                            }
                            className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <label className="block text-[14px] font-medium text-gray-700">
                          Weight
                        </label>
                        <div className="flex">
                          <div className="flex items-center pointer-events-none">
                            <Scale className="h-8 w-8 text-gray-400" />
                          </div>
                          <input
                            value={variant.weights}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "weights",
                                e.target.value
                              )
                            }
                            className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="e.g., 500g"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <label className="block text-[14px] font-medium text-gray-700">
                          Quantity *
                        </label>
                        <div className="flex">
                          <div className="flex items-center pointer-events-none">
                            <Hash className="h-8 w-8 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            value={variant.quantity}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            required
                            className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Product Image */}
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-[14px] font-medium text-gray-700">
                          Product Image *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              productImage: e.target.files?.[0] || null,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <p className="text-[14px] text-gray-500">
              All fields marked with * are required
            </p>

            <div className="flex items-center gap-3">
              <div className="">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>

              <div className="">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                    isSubmitting ? "opacity-70 cursor-wait" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddProductPage;
