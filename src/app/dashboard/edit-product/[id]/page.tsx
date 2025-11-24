// app/products/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Product,
  Category,
  ProductVariant,
  ProductImage,
} from "../../types/product";
import { productApi } from "../../lib/api";
import { Upload } from "lucide-react";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productData, categoriesData] = await Promise.all([
        productApi.getProductById(productId),
        productApi.getAllCategories(),
      ]);

      console.log("🟢 Loaded product data:", productData);
      console.log("🟢 Product images:", productData.productImages);

      // Ensure product has all required arrays
      const safeProductData = {
        ...productData,
        productImages: productData.productImages || [],
        variants: productData.variants || [],
      };

      setProduct(safeProductData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(`Failed to load product data: ${err.message}`);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Prepare update data according to API requirements
      const updateData: any = {
        category_id: product.category_id,
        productName: product.productName,
        description: product.description,
        has_variants: product.has_variants,
      };

      // Only include these fields if they have values
      if (product.regularPrice !== null && product.regularPrice !== "") {
        updateData.regularPrice = product.regularPrice;
      }
      if (product.salePrice !== null && product.salePrice !== "") {
        updateData.salePrice = product.salePrice;
      }
      if (product.weights !== null && product.weights !== "") {
        updateData.weights = product.weights;
      }
      if (product.quantity !== null && product.quantity !== undefined) {
        updateData.quantity = product.quantity;
      }

      // Include product images data
      const productImages = product.productImages || [];
      const mainImage = productImages.find((img) => img.is_main === 1);
      const additionalImages = productImages.filter((img) => img.is_main !== 1);

      if (mainImage || additionalImages.length > 0) {
        updateData.productImages = {
          mainImage: mainImage?.image_url || "",
          additionalImages: additionalImages.map((img) => img.image_url),
        };
      }

      // Include variants data if product has variants
      if (product.has_variants === 1 && product.variants.length > 0) {
        updateData.variants = product.variants.map((variant) => ({
          product_variant_id:
            variant.product_variant_id > 0
              ? variant.product_variant_id
              : undefined,
          productVariantName:
            variant.productVariantName ||
            `Variant ${variant.product_variant_id}`,
          regularPrice: variant.regularPrice || "0",
          salePrice: variant.salePrice || "0",
          weights: variant.weights || "",
          quantity: variant.quantity || 0,
          is_default: variant.is_default || 0,
        }));
      }

      console.log("Final update data being sent:", updateData);

      const response = await productApi.updateProduct(productId, updateData);
      console.log("Update response:", response);

      setSuccess("Product updated successfully!");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update product";
      setError(errorMessage);
      console.error("Error updating product:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!product) return;

    const { name, value } = e.target;
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "category_id" ||
              name === "has_variants" ||
              name === "quantity"
                ? value === ""
                  ? null
                  : parseInt(value)
                : value,
          }
        : null
    );
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    if (!product) return;

    setProduct((prev) => {
      if (!prev) return null;

      const updatedVariants = [...prev.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]:
          field === "quantity" || field === "is_default"
            ? value === ""
              ? 0
              : parseInt(value)
            : value,
      };

      return {
        ...prev,
        variants: updatedVariants,
      };
    });
  };

  // Image handling functions
  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!product || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    const fileName = `main-${Date.now()}-${file.name}`;

    try {
      setUploadingImages((prev) => [...prev, fileName]);

      // In a real application, you would upload the file to your server here
      // For now, we'll create a blob URL for preview
      const imageUrl = URL.createObjectURL(file);

      setProduct((prev) => {
        if (!prev) return null;

        const currentImages = prev.productImages || [];

        // Remove existing main image flag from all images
        const updatedImages = currentImages.map((img) => ({
          ...img,
          is_main: 0,
        }));

        // Add new main image
        const newMainImage: ProductImage = {
          image_id: Date.now(),
          image_url: imageUrl,
          is_main: 1,
        };

        return {
          ...prev,
          productImages: [newMainImage, ...updatedImages],
        };
      });
    } catch (error) {
      console.error("Error uploading main image:", error);
      setError("Failed to upload main image");
    } finally {
      setUploadingImages((prev) => prev.filter((name) => name !== fileName));
    }
  };

  const handleAdditionalImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!product || !e.target.files) return;

    const files = Array.from(e.target.files);
    const newImages: ProductImage[] = [];

    try {
      for (const file of files) {
        const fileName = `additional-${Date.now()}-${file.name}`;
        setUploadingImages((prev) => [...prev, fileName]);

        // In a real application, you would upload the file to your server here
        // For now, we'll create a blob URL for preview
        const imageUrl = URL.createObjectURL(file);

        newImages.push({
          image_id: Date.now() + Math.random(),
          image_url: imageUrl,
          is_main: 0,
        });

        setUploadingImages((prev) => prev.filter((name) => name !== fileName));
      }

      setProduct((prev) =>
        prev
          ? {
              ...prev,
              productImages: [...(prev.productImages || []), ...newImages],
            }
          : null
      );
    } catch (error) {
      console.error("Error uploading additional images:", error);
      setError("Failed to upload additional images");
    }
  };

  const setAsMainImage = (imageId: number) => {
    if (!product) return;

    setProduct((prev) => {
      if (!prev) return null;

      const currentImages = prev.productImages || [];
      const updatedImages = currentImages.map((img) => ({
        ...img,
        is_main: img.image_id === imageId ? 1 : 0,
      }));

      return {
        ...prev,
        productImages: updatedImages,
      };
    });
  };

  const removeImage = (imageId: number) => {
    if (!product) return;

    setProduct((prev) =>
      prev
        ? {
            ...prev,
            productImages: (prev.productImages || []).filter(
              (img) => img.image_id !== imageId
            ),
          }
        : null
    );
  };

  const addNewVariant = () => {
    if (!product) return;

    const newVariant: ProductVariant = {
      product_variant_id: -Date.now(), // Negative ID for new variants
      productVariantName: `New Variant ${product.variants.length + 1}`,
      regularPrice: "0",
      salePrice: "0",
      weights: "",
      quantity: 0,
      is_default: product.variants.length === 0 ? 1 : 0, // First variant is default
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      variantImages: [],
    };

    setProduct((prev) =>
      prev
        ? {
            ...prev,
            variants: [...prev.variants, newVariant],
          }
        : null
    );
  };

  const removeVariant = (index: number) => {
    if (!product) return;

    setProduct((prev) =>
      prev
        ? {
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index),
          }
        : null
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-xl">Product not found</div>
      </div>
    );
  }

  // Safe access to product images with proper filtering
  const productImages = product.productImages || [];

  // Find main image (is_main === 1) or use the first image if no main is set
  const mainImage =
    productImages.find((img) => img.is_main === 1) ||
    (productImages.length > 0 ? { ...productImages[0], is_main: 1 } : null);

  // Additional images are all images that are not the main image
  const additionalImages = productImages.filter((img) =>
    mainImage ? img.image_id !== mainImage.image_id : true
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center transition-colors text-md font-medium"
          >
            ← Back to Products
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-1">
                Update your product details and settings
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-md font-medium text-red-800">Error</h3>
                <p className="text-md text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-md font-medium text-green-800">Success</h3>
                <p className="text-md text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Product Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white shadow-sm rounded-2xl border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-md font-medium text-gray-700">
                      Product Name *
                    </label>
                    <div className="border border-gray-300 rounded-xl">
                      <input
                        type="text"
                        name="productName"
                        value={product.productName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category_id"
                      value={product.category_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option
                          key={category.category_id}
                          value={category.category_id}
                        >
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <div className="border border-gray-300 rounded-xl">
                      <textarea
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter product description..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Card */}
              <div className="bg-white shadow-sm rounded-2xl border border-gray-200">
                <div className="">
                  <h2 className="text-lg mt-3 pl-4 font-semibold text-gray-900">
                    Product Details
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-2">
                        Has Variants
                      </label>
                      <select
                        name="has_variants"
                        value={product.has_variants}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={0}>No Variants</option>
                        <option value={1}>Has Variants</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Pricing & Inventory Card */}
                <div className="">
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">
                          Regular Price
                        </label>
                        <div className="border border-gray-300 rounded-xl">
                          <input
                            type="number"
                            name="regularPrice"
                            value={product.regularPrice || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">
                          Sale Price
                        </label>
                        <div className="border border-gray-300 rounded-xl">
                          <input
                            type="number"
                            name="salePrice"
                            value={product.salePrice || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">
                          Weight
                        </label>
                        <div className="border border-gray-300 rounded-xl">
                          <input
                            type="text"
                            name="weights"
                            value={product.weights || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 500g, 1kg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <div className="border border-gray-300 rounded-xl">
                          <input
                            type="number"
                            name="quantity"
                            value={product.quantity || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              {product.has_variants === 1 && (
                <div className="bg-white shadow-sm rounded-2xl border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Product Variants
                      </h2>
                      <div className="text-green-500">
                        <button
                          type="button"
                          onClick={addNewVariant}
                          className="px-4 py-2 text-green-500 rounded-md hover:bg-blue-700 hover:border-green-500 focus:outline-none transition-colors text-md font-medium"
                        >
                          + Add Variant
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {product.variants.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <p className="mt-2 text-md">No variants added</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Click "Add Variant" to create one
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {product.variants.map((variant, index) => (
                          <div
                            key={variant.product_variant_id}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-md font-medium text-gray-800">
                                Variant {index + 1}
                                {variant.is_default === 1 && (
                                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                    Default
                                  </span>
                                )}
                              </h3>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => removeVariant(index)}
                                  className="px-3 py-1 bg-red-600 text-red-400 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-md transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-md font-medium text-gray-700 mb-2">
                                  Variant Name *
                                </label>
                                <div className="border border-gray-300 rounded-xl">
                                  <input
                                    type="text"
                                    value={variant.productVariantName}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        index,
                                        "productVariantName",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-md font-medium text-gray-700 mb-2">
                                  Regular Price *
                                </label>
                                <div className="border border-gray-300 rounded-xl">
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
                                    className="w-full px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-md font-medium text-gray-700 mb-2">
                                  Sale Price *
                                </label>
                                <div className="border border-gray-300 rounded-xl">
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
                                    className="w-full px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-md font-medium text-gray-700 mb-2">
                                  Weight
                                </label>
                                <div className="border border-gray-300 rounded-xl">
                                  <input
                                    type="text"
                                    value={variant.weights}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        index,
                                        "weights",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 500g"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-md font-medium text-gray-700 mb-2">
                                  Quantity *
                                </label>
                                <div className="border border-gray-300 rounded-xl">
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
                                    className="w-full px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                    min="0"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-md font-medium text-gray-700 mb-2">
                                  Is Default
                                </label>
                                <div className="border border-gray-300 rounded-xl">
                                  <select
                                    value={variant.is_default}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        index,
                                        "is_default",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-3 py-2 focus:outline-none focus:border-transparent"
                                  >
                                    <option value={0}>No</option>
                                    <option value={1}>Yes</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Images and Actions */}
            <div className="space-y-8">
              {/* Images Card */}
              <div className="max-w-[330px]">
                <div className="p-6 space-y-6">
                  <div className="bg-white shadow-md rounded-2xl border border-gray-200 p-4">
                    {/* Main Image */}
                    <div className="text-center">
                      <h4 className="text-[24px] text-center mt-3 font-semibold text-gray-900">
                        Product Images
                      </h4>
                    </div>

                    <div className="max-w-[300px] w-full">
                      <h4 className="text-md font-medium text-gray-700 mb-3">
                        Main Image
                      </h4>
                      <div className="p-4 text-center hover:border-gray-400 transition-colors">
                        {mainImage ? (
                          <div className="relative">
                            <img
                              src={mainImage.image_url}
                              alt="Main product"
                              className="w-full h-48 object-cover rounded-lg mx-auto"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/api/placeholder/400/400";
                              }}
                            />
                            <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              Main
                            </div>
                          </div>
                        ) : (
                          <div className="py-8">
                            <div className="text-gray-400 mb-2">
                              <svg
                                className="w-12 h-12 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <p className="text-gray-500 text-md">
                              No main image
                            </p>
                          </div>
                        )}

                        <label className="mt-3 cursor-pointer inline-block">
                          <span className="px-4 flex gap-3 py-2 text-green-500 rounded-md transition-colors text-md font-semibold">
                            <Upload size={17} />
                            {mainImage ? "Change Image" : "Upload Image"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div className="bg-white shadow-md rounded-2xl border border-gray-200 p-6">
                    <div>
                      <div className="mb-3">
                        <h5 className="text-md font-medium text-gray-700">
                          Additional Images
                        </h5>
                      </div>

                      {additionalImages.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <div className="text-gray-400 mb-2">
                            <svg
                              className="w-8 h-8 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-md">
                            No additional images
                          </p>
                          <div className="flex items-center justify-center">
                            <button className="mb-3 cursor-pointer flex items-center justify-center mt-3">
                              <span className="px-4 flex gap-3 py-2 text-green-500 rounded-md transition-colors text-md font-semibold">
                                <Upload size={17} />
                                Upload Images
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleAdditionalImageUpload}
                                className="hidden"
                              />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {additionalImages.map((image, index) => (
                            <div
                              key={image.image_id}
                              className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white"
                            >
                              <div className="">
                                <img
                                  src={image.image_url}
                                  alt={`Additional product view ${index + 1}`}
                                  className="w-full h-24 object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/api/placeholder/200/200";
                                  }}
                                />
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex space-x-1">
                                  <div className="">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setAsMainImage(image.image_id)
                                      }
                                      className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                      title="Set as main image"
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeImage(image.image_id)
                                      }
                                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                      title="Remove image"
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Uploading Indicator */}
                  {uploadingImages.length > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <p className="text-xs text-blue-700 font-medium">
                          Uploading {uploadingImages.length} image(s)...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Card */}
              <div className="bg-white max-w-[320px] w-full shadow-sm rounded-lg border border-gray-200">
                <div className="p-6 space-y-4">
                  <div className="text-white flex items-center justify-center rounded-xl h-[40px] font-semibold bg-green-500">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full px-4 py-2"
                    >
                      {saving ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </span>
                      ) : (
                        "Update Product"
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center rounded-xl h-[40px] border border-green-500 font-semibold hover:bg-green-500 hover:text-white transition-colors">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="w-full px-4 py-2 "
                    >
                      Cancel
                    </button>
                  </div>

                  {/* <div className="">
                    <button
                      type="button"
                      onClick={loadData}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-md"
                    >
                      Reset Changes
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
