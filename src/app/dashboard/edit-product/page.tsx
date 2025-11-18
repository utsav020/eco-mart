"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";

interface VariantImage {
  file?: File;
  preview?: string;
  image_url?: string;
}

interface Variant {
  product_variant_id: number;
  productVariantName: string;
  regularPrice: string;
  salePrice: string;
  weights: string;
  quantity: string;
  variantImages?: VariantImage[];
}

interface Product {
  product_id?: number;
  category_id?: number;
  productName: string;
  regularPrice: string;
  salePrice: string;
  weights: string;
  quantity: string;
  description: string;
  has_variants: number;
  variants: Variant[];
  productImages?: { image_url: string }[];
}

interface ProductInfo {
  key_features: string[];
  health_benefits: string[];
  nutrition_value: string[];
  how_to_prepare: string[];
}

interface Category {
  category_id: number;
  categoryName: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://ekomart-backend.onrender.com/api";

const EditProductPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [product, setProduct] = useState<Product>({
    productName: "",
    regularPrice: "",
    salePrice: "",
    weights: "",
    quantity: "",
    description: "",
    has_variants: 0,
    variants: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    key_features: [],
    health_benefits: [],
    nutrition_value: [],
    how_to_prepare: [],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);

  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);

  const [newFeature, setNewFeature] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newNutrition, setNewNutrition] = useState("");
  const [newPreparation, setNewPreparation] = useState("");
  const [newVariant, setNewVariant] = useState("");

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await axios.get<Category[]>(
          `${API_BASE}/categories/getallcategory`
        );
        if (resp.data) {
          setCategories(resp.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch product and info
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${API_BASE}/product/getproductbyid/${id}`);
        const productData = Array.isArray(resp.data)
          ? resp.data[0]
          : resp.data;

        if (!productData) {
          alert("Product not found");
          router.push("/dashboard/product-list");
          return;
        }

        const prod: Product = {
          product_id: productData.product_id,
          category_id: productData.category_id,
          productName: productData.productName || "",
          regularPrice: productData.regularPrice || "",
          salePrice: productData.salePrice || "",
          weights: productData.weights || "",
          quantity: productData.quantity || "",
          description: productData.description || "",
          has_variants: productData.has_variants ?? 0,
          variants: productData.variants || [],
          productImages: productData.productImages || [],
        };
        setProduct(prod);

        if (prod.productImages && prod.productImages.length > 0) {
          setImagePreview(prod.productImages[0].image_url);
        }

        try {
          const infoResp = await axios.get(
            `${API_BASE}/product/getproductinfo/${id}`
          );
          const info = infoResp.data;
          setProductInfo({
            key_features: info.key_features || [],
            health_benefits: info.health_benefits || [],
            nutrition_value: info.nutrition_value || [],
            how_to_prepare: info.how_to_prepare || [],
          });
        } catch (infoErr) {
          console.warn("Could not fetch product info:", infoErr);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        alert("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  // ✅ FIXED PRODUCT CHANGE HANDLER (main issue)
  const handleProductChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "product_id" || name === "has_variants"
          ? Number(value)
          : value,
    }));
  };

  // ✅ Info handlers
  const addItem = (
    key: keyof ProductInfo,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!value.trim()) return;
    setProductInfo((prev) => ({
      ...prev,
      [key]: [...prev[key], value.trim()],
    }));
    setter("");
  };

  const removeItem = (key: keyof ProductInfo, idx: number) => {
    setProductInfo((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }));
  };

  const handleProductInfoChange = (
    key: keyof ProductInfo,
    idx: number,
    value: string
  ) => {
    setProductInfo((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === idx ? value : item)),
    }));
  };

  // ✅ Variant logic (unchanged)
  const addVariant = () => {
    const name = newVariant.trim();
    if (!name) return;
    const newVar: Variant = {
      product_variant_id: Date.now(),
      productVariantName: name,
      regularPrice: "",
      salePrice: "",
      weights: "",
      quantity: "",
      variantImages: [],
    };
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, newVar],
    }));
    setNewVariant("");
  };

  const removeVariant = (idx: number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  // const handleProductChange = (
  //   idx: number,
  //   field: keyof Product,
  //   value: string | number
  // ) => {
  //   setProduct((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // }

  const handleVariantChange = (
    idx: number,
    field: keyof Variant,
    value: string
  ) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === idx ? { ...v, [field]: value } : v
      ),
    }));
  };

  const handleVariantImageUpload = (variantIdx: number, files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => {
        if (i === variantIdx) {
          return {
            ...v,
            variantImages: [...(v.variantImages || []), ...arr],
          };
        }
        return v;
      }),
    }));
  };

  const removeVariantImage = (variantIdx: number, imgIdx: number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => {
        if (i === variantIdx) {
          return {
            ...v,
            variantImages:
              v.variantImages?.filter((_, j) => j !== imgIdx) || [],
          };
        }
        return v;
      }),
    }));
  };

  const handleRemoveAdditional = (idx: number) => {
    setAdditionalPreviews((prev) => prev.filter((_, i) => i !== idx));
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("product_name", product.productName);
      form.append("description", product.description);
      if (product.product_id !== undefined) {
        form.append("product_id", product.product_id.toString());
      }
      form.append("has_variants", product.has_variants.toString());
      form.append("regularPrice", product.regularPrice);
      form.append("salePrice", product.salePrice);
      form.append("weights", product.weights);
      form.append("quantity", product.quantity);

      if (mainImageFile) form.append("productImages", mainImageFile);
      additionalFiles.forEach((file) => form.append("productImages", file));

      form.append("key_features", JSON.stringify(productInfo.key_features));
      form.append("health_benefits", JSON.stringify(productInfo.health_benefits));
      form.append("nutrition_value", JSON.stringify(productInfo.nutrition_value));
      form.append("how_to_prepare", JSON.stringify(productInfo.how_to_prepare));

      if (product.has_variants && product.variants.length > 0) {
        const variantsMeta = product.variants.map((v) => ({
          product_variant_id: v.product_variant_id,
          productVariantName: v.productVariantName,
          regularPrice: v.regularPrice,
          salePrice: v.salePrice,
          weights: v.weights,
          quantity: v.quantity,
        }));
        form.append("variants", JSON.stringify(variantsMeta));
        product.variants.forEach((v, i) => {
          v.variantImages?.forEach((vi) => {
            if (vi.file) form.append(`variantImages[${i}]`, vi.file);
          });
        });
      }

      const resp = await axios.put(`${API_BASE}/product/updateproduct/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Update response:", resp.data);
      alert("Product updated successfully!");
      router.push("/dashboard/product-list");
    } catch (err: any) {
      console.error("Error updating product:", err);
      alert(err.response?.data?.message || err.message || "Error updating product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1000px] mx-auto">
        <h3 className="text-3xl font-bold mb-6">Edit Product</h3>

        {/* ✅ FIX: main product fields now use handleProductChange */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div>
                <label className="font-medium block mb-2">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={handleProductChange}
                  placeholder="Product Name"
                  className="border p-3 rounded-lg w-full"
                />
              </div>

              <div>
                <label className="font-medium block mb-2">Select Category</label>
                <select
                  name="category_id"
                  value={product.category_id ?? ""}
                  onChange={handleProductChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium block mb-2">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleProductChange}
                  placeholder="Description"
                  className="border p-3 rounded-lg w-full"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
              <h2 className="text-xl font-semibold">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Regular Price</label>
                  <input
                    type="text"
                    name="regularPrice"
                    value={product.regularPrice}
                    onChange={handleProductChange}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>
                <div>
                  <label className="font-medium">Sale Price</label>
                  <input
                    type="text"
                    name="salePrice"
                    value={product.salePrice}
                    onChange={handleProductChange}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>
                <div>
                  <label className="font-medium">Quantity</label>
                  <input
                    type="text"
                    name="quantity"
                    value={product.quantity}
                    onChange={handleProductChange}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>
                <div>
                  <label className="font-medium">Weight</label>
                  <input
                    type="text"
                    name="weights"
                    value={product.weights}
                    onChange={handleProductChange}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>
              </div>
            </div> */}

            <div className="">
               {product.variants.map((v, idx) => (
                    <div
                      key={v.product_variant_id}
                      className="border p-3 rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Variant {idx + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="font-medium">Variant Name</label>
                          <input
                            type="text"
                            value={v.productVariantName}
                            onChange={(e) =>
                              handleVariantChange(idx, "productVariantName", e.target.value)
                            }
                            placeholder="Variant Name"
                            className="border p-2 rounded-lg w-full"
                          />
                        </div>
                        <div>
                          <label className="font-medium">Regular Price</label>
                          <input
                            type="text"
                            value={v.regularPrice}
                            onChange={(e) =>
                              handleVariantChange(idx, "regularPrice", e.target.value)
                            }
                            placeholder="Regular Price"
                            className="border p-2 rounded-lg w-full"
                          />
                        </div>
                        <div>
                          <label className="font-medium">Sale Price</label>
                          <input
                            type="text"
                            value={v.salePrice}
                            onChange={(e) =>
                              handleVariantChange(idx, "salePrice", e.target.value)
                            }
                            placeholder="Sale Price"
                            className="border p-2 rounded-lg w-full"
                          />
                        </div>
                        <div>
                          <label className="font-medium">Weight</label>
                          <input
                            type="text"
                            value={v.weights}
                            onChange={(e) =>
                              handleVariantChange(idx, "weights", e.target.value)
                            }
                            placeholder="Weight"
                            className="border p-2 rounded-lg w-full"
                          />
                        </div>
                        <div>
                          <label className="font-medium">Quantity</label>
                          <input
                            type="text"
                            value={v.quantity}
                            onChange={(e) =>
                              handleVariantChange(idx, "quantity", e.target.value)
                            }
                            placeholder="Quantity"
                            className="border p-2 rounded-lg w-full"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="font-semibold block mb-2">Variant Images</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {v.variantImages?.map((img, i) => (
                            <div
                              key={i}
                              className="relative border w-[150px] h-[150px] rounded-lg overflow-hidden group"
                            >
                              <img
                                src={img.preview || img.image_url || "/placeholder.png"}
                                alt={`Variant ${idx + 1} Image ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariantImage(idx, i)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center mt-2 gap-2">
                          <Upload size={18} className="text-green-500" />
                          <label className="text-green-600 font-semibold cursor-pointer">
                            Change Images
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) =>
                                handleVariantImageUpload(idx, e.target.files)
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Variants Section */}
            {product.has_variants === 1 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                <h2 className="text-xl font-semibold">Variants</h2>
                <div className="space-y-4">
                  {product.variants.map((v, idx) => (
                    <div
                      key={v.product_variant_id}
                      className="border p-3 rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Variant {idx + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="font-medium">Variant Name</label>
                          <input
                            type="text"
                            value={v.productVariantName}
                            onChange={(e) =>
                              handleVariantChange(idx, "productVariantName", e.target.value)
                            }
                            placeholder="Variant Name"
                            className="border p-2 rounded-lg w-full"
                          />
                        </div>
                        <div>
                          <label className="font-medium">Regular Price</label>
                          <input
                            type="text"
                            value={v.regularPrice}
                            onChange={(e) =>
                              handleVariantChange(idx, "regularPrice", e.target.value)
                            }
                            placeholder="Regular Price"
                            className="border p-2 rounded-lg w-full"
                          />
                        </div>
                        <div>
                          <label className="font-medium">Sale Price</label>
                          <input
                            type="text"
                            value={v.salePrice}
                            onChange={(e) =>
                              handleVariantChange(idx, "salePrice", e.target.value)
                            }
                            placeholder="Sale Price"
                            className="border p-2 rounded-lg w-full"
                          />
                        </div>
                        <div>
                          <label className="font-medium">Weight</label>
                          <input
                            type="text"
                            value={v.weights}
                            onChange={(e) =>
                              handleVariantChange(idx, "weights", e.target.value)
                            }
                            placeholder="Weight"
                            className="border p-2 rounded-lg w-full"
                          />
                        </div>
                        <div>
                          <label className="font-medium">Quantity</label>
                          <input
                            type="text"
                            value={v.quantity}
                            onChange={(e) =>
                              handleVariantChange(idx, "quantity", e.target.value)
                            }
                            placeholder="Quantity"
                            className="border p-2 rounded-lg w-full"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="font-semibold block mb-2">Variant Images</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {v.variantImages?.map((img, i) => (
                            <div
                              key={i}
                              className="relative border w-[150px] h-[150px] rounded-lg overflow-hidden group"
                            >
                              <img
                                src={img.preview || img.image_url || "/placeholder.png"}
                                alt={`Variant ${idx + 1} Image ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariantImage(idx, i)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center mt-2 gap-2">
                          <Upload size={18} className="text-green-500" />
                          <label className="text-green-600 font-semibold cursor-pointer">
                            Change Images
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) =>
                                handleVariantImageUpload(idx, e.target.files)
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="New Variant Name"
                      value={newVariant}
                      onChange={(e) => setNewVariant(e.target.value)}
                      className="border p-2 rounded-lg w-full"
                    />
                    <button
                      type="button"
                      onClick={addVariant}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Add Variant
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Info (key_features, etc.) */}
            <div className="bg-white rounded-xl w-full shadow-sm border p-6 space-y-4">
              <h3 className="text-xl font-semibold">Product Info</h3>
              {(
                [
                  {
                    key: "key_features" as keyof ProductInfo,
                    state: newFeature,
                    setter: setNewFeature,
                  },
                  {
                    key: "health_benefits" as keyof ProductInfo,
                    state: newHighlight,
                    setter: setNewHighlight,
                  },
                  {
                    key: "nutrition_value" as keyof ProductInfo,
                    state: newNutrition,
                    setter: setNewNutrition,
                  },
                  {
                    key: "how_to_prepare" as keyof ProductInfo,
                    state: newPreparation,
                    setter: setNewPreparation,
                  },
                ] as {
                  key: keyof ProductInfo;
                  state: string;
                  setter: React.Dispatch<React.SetStateAction<string>>;
                }[]
              ).map((f) => (
                <div key={f.key} className="w-full p-2 rounded-lg">
                  <div className="flex h-20 justify-between mb-2">
                    <h3 className="font-semibold capitalize">
                      {f.key.replace("_", " ")}
                    </h3>
                    <button
                      type="button"
                      onClick={() => addItem(f.key, f.state, f.setter)}
                      className="bg-blue-600 text-white px-3 rounded-lg"
                    >
                      + Add
                    </button>
                  </div>
                  {productInfo[f.key].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 border rounded-lg items-center mb-1"
                    >
                      <input
                        type="text"
                        value={item}
                        className="p-2 rounded-lg flex-grow"
                        onChange={(e) =>
                          handleProductInfoChange(f.key, idx, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(f.key, idx)}
                        className="text-red-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder={`Add ${f.key.replace("_", " ")}`}
                    value={f.state}
                    onChange={(e) => f.setter(e.target.value)}
                    className="border p-2 rounded-lg w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            <div className="bg-white w-full p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Main Image</h2>
              <div className="border-2 h-[210px] border-dashed p-4 flex items-center justify-center rounded-lg mb-4 relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Main Product"
                    className="h-full mx-auto object-contain"
                  />
                ) : (
                  <p className="text-gray-400">No main image available</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Upload size={20} className="text-green-500" />
                <label className="text-green-500 font-semibold px-3 py-1 rounded-lg cursor-pointer">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setMainImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="bg-white w-full p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-medium mb-2">Additional Images</h3>
              <div className="border-2 h-[200px] border-dashed p-4 rounded-lg">
                {additionalPreviews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {additionalPreviews.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Additional ${idx + 1}`}
                          className="h-32 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditional(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No additional images</p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Upload size={20} className="text-green-500" />
                <label className="font-semibold text-green-500 cursor-pointer px-3 py-1 rounded-lg">
                  Add Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const filesArr = Array.from(e.target.files || []);
                      const previews = filesArr.map((f) => URL.createObjectURL(f));
                      setAdditionalPreviews((prev) => [...prev, ...previews]);
                      setAdditionalFiles((prev) => [...prev, ...filesArr]);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white py-3 rounded-lg w-full"
              >
                {submitting ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/product-list")}
                className="border py-3 rounded-lg w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;



// app/products/edit/[id]/page.tsx
// import EditProduct from '../EditProduct';

// interface EditProductPageProps {
//   params: {
//     id: string;
//   };
// }

// export default function EditProductPage({ params }: EditProductPageProps) {
//   return <EditProduct />;
// }



