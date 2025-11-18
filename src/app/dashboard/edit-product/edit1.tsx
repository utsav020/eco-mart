"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";

interface Variant {
  product_variant_id: number;
  productVariantName: string;
  regularPrice: string;
  salePrice: string;
  weights: string;
  quantity: string;
  variantImages: any[];
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
  has_variants?: number;
  productType?: string;
  variants?: Variant[];
  created_at?: string;
  updated_at?: string;
  productImages?: any[];
  productInfo?: string;
}

interface ProductInfo {
  key_features: string[];
  health_benefits: string[];
  nutrition_value: string[];
  how_to_prepare: string[];
}

const EditProductPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const API_BASE_URL = "https://ekomart-backend.onrender.com/api";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [product, setProduct] = useState<Product>({
    productName: "",
    category_id: undefined,
    regularPrice: "",
    salePrice: "",
    weights: "",
    quantity: "",
    description: "",
    has_variants: 0,
    productType: "",
    variants: [],
    productImages: [],
  });

  const [productInfo, setProductInfo] = useState<ProductInfo>({
    key_features: [],
    health_benefits: [],
    nutrition_value: [],
    how_to_prepare: [],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newFeature, setNewFeature] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newNutrition, setNewNutrition] = useState("");
  const [newPreparation, setNewPreparation] = useState("");
  const [newVariant, setNewVariant] = useState("");

  // Fetch product and product info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, infoRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/product/getproductbyid/${id}`),
          axios.get(`${API_BASE_URL}/product/getproductinfo/${id}`),
        ]);

        const data = Array.isArray(productRes.data)
          ? productRes.data[0]
          : productRes.data;

        setProduct({
          product_id: data.product_id,
          productName: data.productName || "",
          category_id: data.category_id || undefined,
          regularPrice: data.regularPrice || "",
          salePrice: data.salePrice || "",
          weights: data.weights || "",
          quantity: data.quantity || "",
          description: data.description || "",
          has_variants: data.has_variants || 0,
          productType: data.productType || "",
          variants: data.variants || [],
          productImages: data.productImages || [],
        });

        if (data.productImages?.length)
          setImagePreview(data.productImages[0].image_url);

        if (infoRes.data) {
          setProductInfo({
            key_features: infoRes.data.key_features || [],
            health_benefits: infoRes.data.health_benefits || [],
            nutrition_value: infoRes.data.nutrition_value || [],
            how_to_prepare: infoRes.data.how_to_prepare || [],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("❌ Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, API_BASE_URL]);

  // Input handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "category_id" || name === "has_variants"
          ? Number(value)
          : value,
    }));
  };

  // Variant handlers
  const addVariant = () => {
    if (!newVariant.trim()) return;
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        {
          product_variant_id: Date.now(),
          productVariantName: newVariant.trim(),
          regularPrice: "",
          salePrice: "",
          weights: "",
          quantity: "",
          variantImages: [],
        },
      ],
    }));
    setNewVariant("");
  };

  const removeVariant = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants ? prev.variants.filter((_, i) => i !== index) : [],
    }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string
  ) => {
    setProduct((prev) => ({
      ...prev,
      variants:
        prev.variants?.map((v, i) =>
          i === index ? { ...v, [field]: value } : v
        ) || [],
    }));
  };

  // ProductInfo handlers
  const addItem = (
    key: keyof ProductInfo,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!value.trim()) return;
    setProductInfo((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), value.trim()],
    }));
    setter("");
  };

  const removeItem = (key: keyof ProductInfo, index: number) => {
    setProductInfo((prev) => ({
      ...prev,
      [key]: prev[key]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleProductInfoChange = (
    key: keyof ProductInfo,
    index: number,
    value: string
  ) => {
    setProductInfo((prev) => ({
      ...prev,
      [key]: prev[key]?.map((item, i) => (i === index ? value : item)) || [],
    }));
  };

  // Image handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ✅ Update Product Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const Payload = {
        productName: product.productName,
        category_id: product.category_id,
        regularPrice: product.regularPrice,
        salePrice: product.salePrice,
        weights: product.weights,
        quantity: product.quantity,
        description: product.description,
        has_variants: product.has_variants,
        productType: product.productType,
        variants: product.variants || [],
      };

      const infoPayload = { ...productInfo };

      await axios.all([
        axios.put(`${API_BASE_URL}/product/updateproduct/${id}`, Payload),
        axios.put(`${API_BASE_URL}/product/updateproductinfo/${id}`, infoPayload),
      ]);

      alert("✅ Product updated successfully!");
      router.push("/dashboard/product-list");
    } catch (error: any) {
      console.error("Update failed:", error);
      alert(
        `❌ Update failed: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
 return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Left Section */}
          <div className="lg:col-span-3 space-y-8">
            {/* Basic Info */}
            <div className="bg-white p-6 border rounded-xl space-y-4 shadow-sm">
              <h2 className="text-xl font-semibold">Basic Info</h2>
              <input
                type="text"
                name="productName"
                value={product.productName}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border p-3 rounded-lg"
              />
              <select
                name="category_id"
                value={product.category_id ?? ""}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option value="">Select Category</option>
                <option value={1}>Dried Fruit</option>
                <option value={2}>Nuts</option>
                <option value={3}>Spices</option>
                <option value={4}>Grains</option>
              </select>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-3 rounded-lg"
              />
            </div>

            {/* Details */}
            <div className="bg-white p-6 border rounded-xl space-y-4 shadow-sm">
              <h2 className="text-xl font-semibold">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["regularPrice", "salePrice", "weights", "quantity"].map(
                  (field) => (
                    <input
                      key={field}
                      type="text"
                      name={field}
                      value={(product as any)[field]}
                      onChange={handleChange}
                      placeholder={field.replace(/([A-Z])/g, " $1")}
                      className="w-full border p-3 rounded-lg"
                    />
                  )
                )}
              </div>
              <select
                name="has_variants"
                value={product.has_variants}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option value={0}>No Variants</option>
                <option value={1}>Has Variants</option>
              </select>
            </div>

            {/* Variants */}
            {product.has_variants === 1 && (
              <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
                <h2 className="text-xl font-semibold">Variants</h2>
                <input
                  type="text"
                  name="productType"
                  value={product.productType}
                  onChange={handleChange}
                  placeholder="Product Type"
                  className="w-full border p-3 rounded-lg mb-4"
                />
                {product.variants?.map((variant, i) => (
                  <div
                    key={variant.product_variant_id}
                    className="border p-3 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Variant {i + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="text-red-600"
                      >
                        <X />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(
                        [
                          "productVariantName",
                          "regularPrice",
                          "salePrice",
                          "weights",
                          "quantity",
                        ] as (keyof Variant)[]
                      ).map((field) => (
                        <input
                          key={field}
                          type="text"
                          value={variant[field]}
                          onChange={(e) =>
                            handleVariantChange(i, field, e.target.value)
                          }
                          placeholder={field.replace(/([A-Z])/g, " $1")}
                          className="border p-2 rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newVariant}
                    onChange={(e) => setNewVariant(e.target.value)}
                    placeholder="Add Variant"
                    className="flex-1 border p-2 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addVariant}
                    className="bg-blue-600 text-white px-4 rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Product Info */}
             <div className="bg-white rounded-xl w-full shadow-sm border p-6 space-y-4">
              {(
                [
                  {
                    key: "key_features",
                    state: newFeature,
                    setter: setNewFeature,
                  },
                  {
                    key: "health_benefits",
                    state: newHighlight,
                    setter: setNewHighlight,
                  },
                  {
                    key: "nutrition_value",
                    state: newNutrition,
                    setter: setNewNutrition,
                  },
                  {
                    key: "how_to_prepare",
                    state: newPreparation,
                    setter: setNewPreparation,
                  },
                ] as {
                  key: keyof ProductInfo;
                  state: string;
                  setter: React.Dispatch<React.SetStateAction<string>>;
                }[]
              ).map((f) => (
                <div className="w-full border-2 p-2 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-semibold capitalize">
                      {f.key.replace("_", " ")}
                    </h3>
                    <div className="mt-4">
                      <button
                      type="button"
                      onClick={() => addItem(f.key, f.state, f.setter)}
                      className="bg-blue-600 text-black px-3 rounded-lg"
                    >
                      + Add
                    </button>
                    </div>
                  </div>
                  {(productInfo[f.key] || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 border rounded-lg items-center mb-1"
                    >
                      <input
                        type="text"
                        value={item}
                        className="p-2 rounded-lg flex-1"
                        onChange={(e) =>
                          handleProductInfoChange(f.key, idx, e.target.value)
                        }
                      />
                      <div className="">
                        <button
                        type="button"
                        onClick={() => removeItem(f.key, idx)}
                        className="text-red-600"
                      >
                        ×
                      </button>
                      </div>
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

           {/* Right Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Main Image</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-48 object-cover rounded-lg"
                  />
                ) : (
                  <p className="text-gray-400">No image selected</p>
                )}
                <input
                  type="file"
                  id="mainImageUpload"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("mainImageUpload")?.click()
                  }
                  className="mt-2 text-blue-600"
                >
                  Upload
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-black py-3 rounded-lg disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/products")}
                className="border py-3 rounded-lg"
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

// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";
// import { API_BASE_URL } from "@/lib/api";
// import { X, Plus, Upload, TextAlignStart, Edit3, AlertCircle, ImageIcon, Layers, FileText } from "lucide-react";

// interface Variant {
//   product_variant_id: number;
//   productVariantName: string;
//   regularPrice: string;
//   salePrice: string;
//   weights: string;
//   quantity: string;
//   is_default: number;
//   created_at: string;
//   updated_at: string;
//   variantImages: any[];
// }

// interface Product {
//   product_id?: number;
//   productName: string;
//   category: string;
//   description: string;
//   details: string[];
//   highlights: string[];
//   features: string[];
//   nutrition: string[];
//   variants: Variant[];
// }

// export default function EditProductPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [product, setProduct] = useState<Product>({
//     productName: "",
//     category: "",
//     description: "",
//     details: [],
//     highlights: [],
//     features: [],
//     nutrition: [],
//     variants: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchProduct() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/product/getproductbyid/${id}`);
//         const data = res.data;

//         setProduct({
//           ...data,
//           details: data.details || [],
//           highlights: data.highlights || [],
//           features: data.features || [],
//           nutrition: data.nutrition || [],
//           variants: data.variants || [],
//         });
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load product");
//       }
//     }
//     fetchProduct();
//   }, [id]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setProduct({ ...product, [e.target.name]: e.target.value });
//   };

//   const handleArrayChange = (key: keyof Product, value: string, index: number) => {
//     const arr = product[key] || [];
//     const newArr = [...arr];
//     newArr[index] = value;
//     setProduct({ ...product, [key]: newArr });
//   };

//   const addArrayItem = (key: keyof Product) => {
//     const arr = product[key] || [];
//     setProduct({ ...product, [key]: [...arr, ""] });
//   };

//   const removeArrayItem = (key: keyof Product, index: number) => {
//     const arr = product[key] || [];
//     setProduct({ ...product, [key]: arr.filter((_, i) => i !== index) });
//   };

//   const handleUpdate = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       await axios.put(`${API_BASE_URL}/products/${id}`, product);
//       router.push("/products"); // redirect after update
//     } catch (err: any) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to update product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

//       {error && <div className="text-red-600 mb-4">{error}</div>}

//       <div className="bg-white p-6 rounded-xl shadow space-y-4">
//         <div>
//           <label className="block font-semibold mb-1">Product Name</label>
//           <input
//             type="text"
//             name="productName"
//             value={product.productName}
//             onChange={handleInputChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block font-semibold mb-1">Category</label>
//           <input
//             type="text"
//             name="category"
//             value={product.category}
//             onChange={handleInputChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block font-semibold mb-1">Description</label>
//           <textarea
//             name="description"
//             value={product.description}
//             onChange={handleInputChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         {/* Features / Highlights / Nutrition / Details */}
//         {(["features", "highlights", "nutrition", "details"] as const).map((key) => (
//           <div key={key}>
//             <label className="block font-semibold mb-1 capitalize">{key}</label>
//             {product[key].map((item, idx) => (
//               <div key={idx} className="flex items-center mb-2 gap-2">
//                 <input
//                   type="text"
//                   value={item}
//                   onChange={(e) => handleArrayChange(key, e.target.value, idx)}
//                   className="flex-1 border p-2 rounded"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeArrayItem(key, idx)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addArrayItem(key)}
//               className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
//             >
//               <Plus size={16} /> Add {key.slice(0, -1)}
//             </button>
//           </div>
//         ))}

//         {/* Update Button */}
//         <button
//           type="button"
//           onClick={handleUpdate}
//           disabled={loading}
//           className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//         >
//           {loading ? "Updating..." : "Update Product"}
//         </button>
//       </div>
//     </div>
//   );
// }





// next page code


// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useRouter } from "next/navigation";
// import { Upload, X } from "lucide-react";
// import { API_BASE_URL } from "@/lib/api";

// interface Variant {
//   product_variant_id: number;
//   productVariantName: string;
//   regularPrice: string;
//   salePrice: string;
//   weights: string;
//   quantity: string;
//   variantImages?: any[];
// }

// interface Product {
//   product_id?: number;
//   category_id?: number;
//   productName: string;
//   regularPrice: string;
//   salePrice: string;
//   weights: string;
//   quantity: string;
//   description: string;
//   has_variants?: number;
//   productType?: string;
//   variants?: Variant[];
//   productImages?: { image_url: string }[];
// }

// interface ProductInfo {
//   key_features: string[];
//   health_benefits: string[];
//   nutrition_value: string[];
//   how_to_prepare: string[];
// }

// interface Category {
//   category_id: number;
//   categoryName: string;
// }

// const EditProductPage: React.FC = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const API_BASE_URL = "https://ekomart-backend.onrender.com/api";

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [product, setProduct] = useState<Product>({
//     productName: "",
//     regularPrice: "",
//     salePrice: "",
//     weights: "",
//     quantity: "",
//     description: "",
//     has_variants: 0,
//     productType: "",
//     variants: [],
//   });

//   const [categories, setCategories] = useState<Category[]>([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/categories/getallcategory`
//         );
//         if (response.data && Array.isArray(response.data)) {
//           setCategories(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const [productInfo, setProductInfo] = useState<ProductInfo>({
//     key_features: [],
//     health_benefits: [],
//     nutrition_value: [],
//     how_to_prepare: [],
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const [newFeature, setNewFeature] = useState("");
//   const [newHighlight, setNewHighlight] = useState("");
//   const [newNutrition, setNewNutrition] = useState("");
//   const [newPreparation, setNewPreparation] = useState("");
//   const [newVariant, setNewVariant] = useState("");

//   const addItem = (
//     key: keyof ProductInfo,
//     value: string,
//     setter: React.Dispatch<React.SetStateAction<string>>
//   ) => {
//     if (!value.trim()) return;
//     setProductInfo((prev) => ({
//       ...prev,
//       [key]: [...(prev[key] || []), value.trim()],
//     }));
//     setter("");
//   };

//   const removeItem = (key: keyof ProductInfo, index: number) => {
//     setProductInfo((prev) => ({
//       ...prev,
//       [key]: prev[key]?.filter((_, i) => i !== index) || [],
//     }));
//   };

//   const handleProductInfoChange = (
//     key: keyof ProductInfo,
//     index: number,
//     value: string
//   ) => {
//     setProductInfo((prev) => ({
//       ...prev,
//       [key]: prev[key]?.map((item, i) => (i === index ? value : item)) || [],
//     }));
//   };

//   const [mainImageFile, setMainImageFile] = useState<File | null>(null);
//   const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
//   const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);

//   const handleRemoveAdditional = (index: number) => {
//     setAdditionalPreviews((prev) => prev.filter((_, i) => i !== index));
//     setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const productRes = await axios.get(
//           `${API_BASE_URL}/product/getproductbyid/${id}`
//         );

//         const productData = Array.isArray(productRes.data)
//           ? productRes.data[0]
//           : productRes.data;

//         if (!productData) {
//           alert("Product not found");
//           return;
//         }

//         setProduct({
//           product_id: productData.product_id,
//           productName: productData.productName || "",
//           category_id: productData.category_id || undefined,
//           regularPrice: productData.regularPrice || "",
//           salePrice: productData.salePrice || "",
//           weights: productData.weights || "",
//           quantity: productData.quantity || "",
//           description: productData.description || "",
//           has_variants: productData.has_variants || 0,
//           productType: productData.productType || "",
//           variants: productData.variants || [],
//           productImages: productData.productImages || [],
//         });

//         if (productData.productImages?.length) {
//           setImagePreview(productData.productImages[0].image_url);
//         }

//         try {
//           const infoRes = await axios.get(
//             `${API_BASE_URL}/product/getproductinfo/${id}`
//           );

//           if (infoRes.data) {
//             setProductInfo({
//               key_features: infoRes.data.key_features || [],
//               health_benefits: infoRes.data.health_benefits || [],
//               nutrition_value: infoRes.data.nutrition_value || [],
//               how_to_prepare: infoRes.data.how_to_prepare || [],
//             });
//           }
//         } catch {
//           console.warn("Product info not found, skipping...");
//         }
//       } catch (err) {
//         console.error("Error fetching product:", err);
//         alert("❌ Failed to fetch product data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchData();
//   }, [id]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setProduct((prev) => ({
//       ...prev,
//       [name]:
//         name === "category_id" || name === "has_variants"
//           ? Number(value)
//           : value,
//     }));
//   };

//   const addVariant = () => {
//     if (!newVariant.trim()) return;
//     setProduct((prev) => ({
//       ...prev,
//       variants: [
//         ...(prev.variants || []),
//         {
//           product_variant_id: Date.now(),
//           productVariantName: newVariant.trim(),
//           regularPrice: "",
//           salePrice: "",
//           weights: "",
//           quantity: "",
//           variantImages: [],
//         },
//       ],
//     }));
//     setNewVariant("");
//   };

//   const removeVariant = (index: number) => {
//     setProduct((prev) => ({
//       ...prev,
//       variants: prev.variants
//         ? prev.variants.filter((_, i) => i !== index)
//         : [],
//     }));
//   };

//   const handleVariantChange = (
//     index: number,
//     field: keyof Variant,
//     value: string
//   ) => {
//     setProduct((prev) => ({
//       ...prev,
//       variants:
//         prev.variants?.map((v, i) =>
//           i === index ? { ...v, [field]: value } : v
//         ) || [],
//     }));
//   };

//   // ✅ NEW — Variant Image Upload Handlers
//   const handleVariantImageUpload = (index: number, files: FileList | null) => {
//     if (!files) return;
//     const newImages = Array.from(files).map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));

//     setProduct((prev) => ({
//       ...prev,
//       variants:
//         prev.variants?.map((variant, i) =>
//           i === index
//             ? {
//                 ...variant,
//                 variantImages: [...(variant.variantImages || []), ...newImages],
//               }
//             : variant
//         ) || [],
//     }));
//   };

//   const removeVariantImage = (variantIndex: number, imageIndex: number) => {
//     setProduct((prev) => ({
//       ...prev,
//       variants:
//         prev.variants?.map((variant, i) =>
//           i === variantIndex
//             ? {
//                 ...variant,
//                 variantImages:
//                   variant.variantImages?.filter(
//                     (_, idx) => idx !== imageIndex
//                   ) || [],
//               }
//             : variant
//         ) || [],
//     }));
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setSubmitting(true);

//   //   try {
//   //     const productPayload = {
//   //       productName: product.productName,
//   //       category_id: product.category_id,
//   //       regularPrice: product.regularPrice,
//   //       salePrice: product.salePrice,
//   //       weights: product.weights,
//   //       quantity: product.quantity,
//   //       description: product.description,
//   //       has_variants: product.has_variants,
//   //       productType: product.productType,
//   //       variants: product.has_variants ? product.variants : [],
//   //     };

//   //     const infoPayload = {
//   //       key_features: productInfo.key_features,
//   //       health_benefits: productInfo.health_benefits,
//   //       nutrition_value: productInfo.nutrition_value,
//   //       how_to_prepare: productInfo.how_to_prepare,
//   //     };

//   //     await axios.put(
//   //       `${API_BASE_URL}/product/updateproduct/${id}`,
//   //       productPayload
//   //     );

//   //     await axios.put(
//   //       `${API_BASE_URL}/product/updateproductinfo/${id}`,
//   //       infoPayload
//   //     );

//   //     alert("✅ Product updated successfully!");
//   //     router.push("/dashboard/product-list");
//   //   } catch (error: any) {
//   //     console.error("Update failed:", error);
//   //     alert(
//   //       `❌ Update failed: ${
//   //         error.response?.data?.message || error.message || "Unknown error"
//   //       }`
//   //     );
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };
//   // Inside your Edit Product Page (page.tsx)
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();

//       // ✅ Append product fields
//       formData.append("product_name", product.productName || "");
//       formData.append("description", product.description || "");
//       formData.append("category_id", product.category_id?.toString() || "");
//       formData.append("has_variants", product.has_variants?.toString() || "0");

//       // ✅ Append main images (if any)
//       if (mainImageFile) {
//         formData.append("productImages", mainImageFile);
//       }
//       if (additionalFiles && additionalFiles.length > 0) {
//         additionalFiles.forEach((file: File) => {
//           formData.append("productImages", file);
//         });
//       }

//       // ✅ Append variants if present
//       if (product.has_variants && product.variants && product.variants.length > 0) {
//         formData.append("variants", JSON.stringify(product.variants));
//       }

//       // ✅ Make sure the endpoint and method are correct
//       const response = await axios.put(
//         `${API_BASE_URL}/product/updateproduct/${id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("✅ Product updated successfully:", response.data);
//       alert("Product updated successfully!");
//       router.push("/dashboard/product-list");
//     } catch (error: any) {
//       console.error("❌ Error updating product:", error);

//       if (error.response) {
//         console.error("🔍 Backend Response:", error.response.data);
//         alert(
//           `Server Error (${error.response.status}): ${
//             error.response.data.message || "Something went wrong on the server."
//           }`
//         );
//       } else if (error.request) {
//         alert("No response from server. Please check your API connection.");
//       } else {
//         alert(`Error: ${error.message}`);
//       }
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//       </div>
//     );

//   // Removed duplicate setNewHighlight function declaration to fix error.

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-[1000px] mx-auto">
//         <h3 className="text-3xl font-bold mb-6">Edit Product</h3>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 lg:grid-cols-4 gap-8"
//         >
//           {/* LEFT */}
//           <div className="lg:col-span-3 space-y-8">
//             {/* Product Info */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
//               <h2 className="text-xl font-semibold">Basic Information</h2>

//               <div className="">
//                 <label className="font-medium block mb-2">Product Name</label>
//                 <div className="">
//                   <input
//                     type="text"
//                     name="productName"
//                     value={product.productName}
//                     onChange={handleChange}
//                     placeholder="Product Name"
//                     className="border p-3 rounded-lg w-full"
//                   />
//                 </div>
//               </div>

//               <div className="">
//                 <label className="font-medium block mb-2">
//                   Select Category
//                 </label>
//                 <div className="">
//                   <select
//                     name="category_id"
//                     value={product.category_id || ""}
//                     onChange={handleChange}
//                     className="w-full rounded-md border border-gray-300 p-2"
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((cat) => (
//                       <option key={cat.category_id} value={cat.category_id}>
//                         {cat.categoryName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="">
//                 <label className="font-medium block mb-2">Description</label>
//                 <div className="">
//                   <textarea
//                     name="description"
//                     value={product.description}
//                     onChange={handleChange}
//                     placeholder="Description"
//                     className="border p-3 rounded-lg w-full"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Product Details */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
//               <h2 className="text-xl font-semibold">Details</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="">
//                   <label className="font-medium">Regular Price</label>
//                   <div className="border p-3 rounded-lg w-full">
//                     <input
//                       type="text"
//                       name="regularPrice"
//                       value={product.regularPrice}
//                       onChange={handleChange}
//                       placeholder="Regular Price"
//                       className=""
//                     />
//                   </div>
//                 </div>
//                 <div className="">
//                   <label className="font-medium">Sale Price</label>
//                   <div className="border p-3 rounded-lg w-full">
//                     <input
//                       type="text"
//                       name="salePrice"
//                       value={product.salePrice}
//                       onChange={handleChange}
//                       placeholder="Sale Price"
//                       className=""
//                     />
//                   </div>
//                 </div>
//                 <div className="">
//                   <label className="font-medium">Quantity</label>
//                   <div className="border p-3 rounded-lg w-full">
//                     <input
//                       type="text"
//                       name="quantity"
//                       value={product.quantity}
//                       onChange={handleChange}
//                       placeholder="Quantity"
//                       className=""
//                     />
//                   </div>
//                 </div>
//                 <div className="">
//                   <label className="font-medium">Weight</label>
//                   <div className="border p-3 rounded-lg w-full">
//                     <input
//                       type="text"
//                       name="weights"
//                       value={product.weights}
//                       onChange={handleChange}
//                       placeholder="Weight"
//                       className=""
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Variants (Conditional) */}
//             {product.has_variants === 1 && (
//               <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
//                 <h2 className="text-xl font-semibold">Variants</h2>

//                 {product.variants?.length ? (
//                   product.variants.map((v, idx) => (
//                     <div
//                       key={v.product_variant_id}
//                       className="border p-3 rounded-lg space-y-2"
//                     >
//                       <div className="flex justify-between items-center">
//                         <h3 className="font-semibold">Variant {idx + 1}</h3>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                         <div className="">
//                           <label className="font-medium">Variant Name</label>
//                           <div className="border p-2 rounded-lg">
//                             <input
//                               type="text"
//                               value={v.productVariantName}
//                               onChange={(e) =>
//                                 setProduct((prev) => ({
//                                   ...prev,
//                                   variants: prev.variants?.map((varnt, i) =>
//                                     i === idx
//                                       ? {
//                                           ...varnt,
//                                           productVariantName: e.target.value,
//                                         }
//                                       : varnt
//                                   ),
//                                 }))
//                               }
//                               placeholder="Variant Name"
//                               className=""
//                             />
//                           </div>
//                         </div>

//                         <div className="">
//                           <label className="font-medium">Regular Price</label>
//                           <div className="border p-2 rounded-lg">
//                             <input
//                               type="text"
//                               value={v.regularPrice}
//                               onChange={(e) =>
//                                 setProduct((prev) => ({
//                                   ...prev,
//                                   variants: prev.variants?.map((varnt, i) =>
//                                     i === idx
//                                       ? {
//                                           ...varnt,
//                                           regularPrice: e.target.value,
//                                         }
//                                       : varnt
//                                   ),
//                                 }))
//                               }
//                               placeholder="Regular Price"
//                               className=""
//                             />
//                           </div>
//                         </div>

//                         <div className="">
//                           <label className="font-medium">Quantity</label>
//                           <div className="border p-2 rounded-lg">
//                             <input
//                               type="text"
//                               value={v.weights}
//                               onChange={(e) =>
//                                 setProduct((prev) => ({
//                                   ...prev,
//                                   variants: prev.variants?.map((varnt, i) =>
//                                     i === idx
//                                       ? { ...varnt, weights: e.target.value }
//                                       : varnt
//                                   ),
//                                 }))
//                               }
//                               placeholder="Weight"
//                               className=""
//                             />
//                           </div>
//                         </div>

//                         <div className="">
//                           <label className="font-medium">Sale Price</label>
//                           <div className="border p-2 rounded-lg">
//                             <input
//                               type="text"
//                               value={v.salePrice}
//                               onChange={(e) =>
//                                 setProduct((prev) => ({
//                                   ...prev,
//                                   variants: prev.variants?.map((varnt, i) =>
//                                     i === idx
//                                       ? { ...varnt, salePrice: e.target.value }
//                                       : varnt
//                                   ),
//                                 }))
//                               }
//                               placeholder="Sale Price"
//                               className=""
//                             />
//                           </div>
//                         </div>
//                         <div className="mt-4">
//                           <label className="font-semibold text-md block mb-2">
//                             Variant Images
//                           </label>

//                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                             {v.variantImages &&
//                               v.variantImages.map((img, i) => (
//                                 <div
//                                   key={i}
//                                   className="relative border w-[300px] h-[250px] rounded-lg overflow-hidden group"
//                                 >
//                                   <div className="">
//                                     <img
//                                       src={
//                                         img.preview ||
//                                         img.image_url ||
//                                         "/placeholder.png"
//                                       }
//                                       alt={`Variant ${idx + 1} Image ${i + 1}`}
//                                       className="h-24 w-full object-cover"
//                                     />
//                                   </div>
//                                   <div className="absolute top-2 right-2 pl-1 pt-0.5 h-10 w-10 bg-red-500 font-bold text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
//                                     <button
//                                       type="button"
//                                       onClick={() => removeVariantImage(idx, i)}
//                                       className=""
//                                     >
//                                       <X
//                                         size={20}
//                                         className="text-white font-bold"
//                                       />
//                                     </button>
//                                   </div>
//                                 </div>
//                               ))}
//                           </div>

//                           <div className="flex items-center w-full">
//                             <div className="">
//                               <Upload
//                                 size={18}
//                                 className="text-green-500 font-semibold"
//                               />
//                             </div>

//                             <div className="">
//                               <label className="text-green-600 font-semibold text-md px-3 py-1 rounded-lg cursor-pointer">
//                                 Change Images
//                                 <input
//                                   type="file"
//                                   accept="image/*"
//                                   multiple
//                                   className="hidden"
//                                   onChange={(e) =>
//                                     handleVariantImageUpload(
//                                       idx,
//                                       e.target.files
//                                     )
//                                   }
//                                 />
//                               </label>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       {/* ✅ Variant Image Upload */}
//                       {/* <div>
//                         <label className="font-medium block mb-2">
//                           Variant Images
//                         </label>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                           {v.variantImages?.map((img, i) => (
//                             <div
//                               key={i}
//                               className="relative border rounded overflow-hidden group"
//                             >
//                               <div className="">
//                                 <img
//                                   src={img.image_url}
//                                   alt=""
//                                   className="h-24 w-full object-cover"
//                                 />
//                               </div>
//                               <div className="bg-red-500 text-white">
//                                 <button
//                                   type="button"
//                                   onClick={() => removeVariantImage(idx, i)}
//                                   className="absolute top-1 right-1 rounded-full p-1 text-xs opacity-0 group-hover:opacity-100"
//                                 >
//                                   ✕
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         <label className="inline-flex items-center gap-2 mt-3 text-green-600 cursor-pointer font-semibold">
//                           <Upload size={18} />
//                           Upload Images
//                           <input
//                             type="file"
//                             accept="image/*"
//                             multiple
//                             className="hidden"
//                             onChange={() =>
//                               handleVariantImageUpload(idx, e.target.files)
//                             }
//                           />
//                         </label>
//                       </div> */}
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 italic">No variants available</p>
//                 )}
//               </div>
//             )}

//             {/* Product Info */}
//             <div className="bg-white rounded-xl w-full shadow-sm border p-6 space-y-4">
//               <h3>Product Info</h3>
//               {(
//                 [
//                   {
//                     key: "key_features",
//                     state: newFeature,
//                     setter: setNewFeature,
//                   },
//                   {
//                     key: "health_benefits",
//                     state: newHighlight,
//                     setter: setNewHighlight,
//                   },
//                   {
//                     key: "nutrition_value",
//                     state: newNutrition,
//                     setter: setNewNutrition,
//                   },
//                   {
//                     key: "how_to_prepare",
//                     state: newPreparation,
//                     setter: setNewPreparation,
//                   },
//                 ] as {
//                   key: keyof ProductInfo;
//                   state: string;
//                   setter: React.Dispatch<React.SetStateAction<string>>;
//                 }[]
//               ).map((f) => (
//                 <div className="w-full p-2 rounded-lg">
//                   <div className="flex h-20 justify-between mb-2">
//                     <h3 className="font-semibold capitalize">
//                       {f.key.replace("_", " ")}
//                     </h3>
//                     <div className="mt-4">
//                       <button
//                         type="button"
//                         onClick={() => addItem(f.key, f.state, f.setter)}
//                         className="bg-blue-600 text-black px-3 rounded-lg"
//                       >
//                         + Add
//                       </button>
//                     </div>
//                   </div>
//                   {(productInfo[f.key] || []).map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="flex gap-2 border rounded-lg items-center mb-1"
//                     >
//                       <input
//                         type="text"
//                         value={item}
//                         className="p-2 rounded-lg flex"
//                         onChange={(e) =>
//                           handleProductInfoChange(f.key, idx, e.target.value)
//                         }
//                       />
//                       <div className="">
//                         <button
//                           type="button"
//                           onClick={() => removeItem(f.key, idx)}
//                           className="text-red-600"
//                         >
//                           <X />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                   <input
//                     type="text"
//                     placeholder={`Add ${f.key.replace("_", " ")}`}
//                     value={f.state}
//                     onChange={(e) => f.setter(e.target.value)}
//                     className="border p-2 rounded-lg w-full"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="space-y-8">
//             <div className="bg-white w-[300px] h-[320px] p-6 rounded-xl border shadow-sm">
//               <h2 className="text-xl font-semibold mb-3">Main Image</h2>

//               {/* ✅ Main Image (Editable) */}
//               <div className="border-2 h-[210px] border-dashed p-4 text-center rounded-lg mb-4 relative">
//                 {/* <h3 className="text-lg font-medium mb-2"></h3> */}
//                 {imagePreview ? (
//                   <img
//                     src={imagePreview}
//                     alt="Main Product"
//                     className="h-48 mx-auto rounded-lg object-cover"
//                   />
//                 ) : (
//                   <p className="text-gray-400">No main image available</p>
//                 )}
//               </div>
//               <div className="flex items-center">
//                 <div className="">
//                   <Upload size={20} className="text-green-500" />
//                 </div>
//                 <div className="">
//                   <label className="text-green-500 font-semibold text-md px-3 py-1 rounded-lg cursor-pointer transition-colors">
//                     Change Image
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file) {
//                           setImagePreview(URL.createObjectURL(file));
//                           setMainImageFile(file);
//                         }
//                       }}
//                     />
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white w-[300px] h-[320px] p-6 rounded-xl border shadow-sm space-y-4">
//               <div className="">
//                 <h3 className="text-lg font-medium mb-0">Additional Images</h3>
//                 {/* ✅ Additional Images (Editable) */}
//                 <div className="border-2 h-[200px] border-dashed p-4 rounded-lg">
//                   {additionalPreviews && additionalPreviews.length > 0 ? (
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                       {additionalPreviews.map((img, idx) => (
//                         <div key={idx} className="relative group">
//                           <img
//                             src={img}
//                             alt={`Additional ${idx + 1}`}
//                             className="h-32 w-full object-cover rounded-lg"
//                           />
//                           <button
//                             onClick={() => handleRemoveAdditional(idx)}
//                             className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             ✕
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-400 text-center">
//                       No additional images available
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="">
//                   <Upload size={20} className="text-green-500" />
//                 </div>
//                 {/* Add More Images */}
//                 <div className="">
//                   <label className="inline-block font-semibold text-green-500 text-md px-4 py-2 rounded-lg cursor-pointer transition-colors">
//                     Add Images
//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       className="hidden"
//                       onChange={(e) => {
//                         const files = Array.from(e.target.files || []);
//                         const previews = files.map((file) =>
//                           URL.createObjectURL(file)
//                         );
//                         setAdditionalPreviews((prev) => [...prev, ...previews]);
//                         setAdditionalFiles((prev) => [...prev, ...files]);
//                       }}
//                     />
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-xl border shadow-sm">
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="bg-blue-600 text-white py-3 rounded-lg w-full"
//               >
//                 {submitting ? "Updating..." : "Update Product"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => router.push("/dashboard/product-list")}
//                 className="mt-3 border py-3 rounded-lg w-full"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProductPage;


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

// app/edit-product/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';

// // Types
// interface Category {
//   id: number;
//   name: string;
//   description?: string;
// }

// interface Product {
//   id: number;
//   name: string;
//   category: string;
//   description: string;
//   details: string;
//   size: string[];
//   moisture: string;
//   admixture: string;
//   erosionMaterial: string;
//   packaging: string;
//   capacity: {
//     jute: string;
//     vacuum: string;
//   };
//   highlights: string[];
//   features: string[];
//   mainImage?: string;
//   galleryImages: string[];
//   additionalImages: string[];
// }

// interface ProductFormData {
//   name: string;
//   category: string;
//   description: string;
//   details: string;
//   size: string[];
//   moisture: string;
//   admixture: string;
//   erosionMaterial: string;
//   packaging: string;
//   capacity: {
//     jute: string;
//     vacuum: string;
//   };
//   highlights: string[];
//   features: string[];
//   mainImage?: File;
//   galleryImages: File[];
//   additionalImages: File[];
// }

// // API Service
// const API_BASE_URL = 'https://ekomart-backend.onrender.com/api';

// const apiService = {
//   async getProductById(id: number): Promise<Product> {
//     const response = await fetch(`${API_BASE_URL}/product/getproductinfo/${id}`);
//     if (!response.ok) throw new Error('Failed to fetch product');
//     return response.json();
//   },

//   async updateProductInfo(id: number, data: Partial<ProductFormData>): Promise<Product> {
//     const formData = new FormData();
    
//     Object.keys(data).forEach(key => {
//       if (key === 'mainImage' && data.mainImage) {
//         formData.append('mainImage', data.mainImage);
//       } else if (key === 'galleryImages') {
//         data.galleryImages?.forEach((file) => formData.append(`galleryImages`, file));
//       } else if (key === 'additionalImages') {
//         data.additionalImages?.forEach((file) => formData.append(`additionalImages`, file));
//       } else if (key === 'capacity') {
//         formData.append('capacity', JSON.stringify(data.capacity));
//       } else if (key === 'size') {
//         formData.append('size', JSON.stringify(data.size));
//       } else if (key === 'highlights') {
//         formData.append('highlights', JSON.stringify(data.highlights));
//       } else if (key === 'features') {
//         formData.append('features', JSON.stringify(data.features));
//       } else if (data[key as keyof ProductFormData]) {
//         formData.append(key, data[key as keyof ProductFormData] as string);
//       }
//     });

//     const response = await fetch(`${API_BASE_URL}/product/updateproductinfo/${id}`, {
//       method: 'PUT',
//       body: formData,
//     });
//     if (!response.ok) throw new Error('Failed to update product');
//     return response.json();
//   },

//   async getAllCategories(): Promise<Category[]> {
//     const response = await fetch(`${API_BASE_URL}/categories/getallcategory`);
//     if (!response.ok) throw new Error('Failed to fetch categories');
//     return response.json();
//   },
// };

// export default function EditProductPage() {
//   const [productId] = useState(2); // You can make this dynamic
//   const [product, setProduct] = useState<Product | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState('');

//   const [formData, setFormData] = useState<ProductFormData>({
//     name: 'Cashew',
//     category: 'Dried Fruit',
//     description: 'Premium quality cashews with rich flavor and crunchy texture. Perfect for snacking, cooking, and baking.',
//     details: `Cashews are a versatile snack that adds a delicious crunch to any dish.

// Our premium cashews are packed with healthy fats and essential nutrients.

// Perfect for snacking, baking, or adding to dishes for added crunch.

// We offer only the highest quality cashews, handpicked and processed for the best flavor.`,
//     size: ['180', '210', '240', '280', '320'],
//     moisture: '5% Max',
//     admixture: '1% Max',
//     erosionMaterial: '0.5% Max',
//     packaging: 'VACUUM | GOSS. ZORG',
//     capacity: {
//       jute: '20 MT (50kg)',
//       vacuum: '20 MT (25kg)',
//     },
//     highlights: ['Rich in healthy fats', 'Premium quality'],
//     features: ['Handpicked for premium quality', 'Carefully processed'],
//     galleryImages: [],
//     additionalImages: [],
//   });

//   const [newHighlight, setNewHighlight] = useState('');
//   const [newFeature, setNewFeature] = useState('');

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [categoriesData] = await Promise.all([
//         apiService.getAllCategories(),
//       ]);
//       setCategories(categoriesData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//       setMessage('Error loading data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCapacityChange = (field: keyof ProductFormData['capacity'], value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       capacity: { ...prev.capacity, [field]: value },
//     }));
//   };

//   const handleSizeChange = (sizes: string) => {
//     setFormData(prev => ({
//       ...prev,
//       size: sizes.split(',').map(s => s.trim()),
//     }));
//   };

//   const addHighlight = () => {
//     if (newHighlight.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         highlights: [...prev.highlights, newHighlight.trim()],
//       }));
//       setNewHighlight('');
//     }
//   };

//   const removeHighlight = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       highlights: prev.highlights.filter((_, i) => i !== index),
//     }));
//   };

//   const addFeature = () => {
//     if (newFeature.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         features: [...prev.features, newFeature.trim()],
//       }));
//       setNewFeature('');
//     }
//   };

//   const removeFeature = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index),
//     }));
//   };

//   const handleFileChange = (field: 'mainImage' | 'galleryImages' | 'additionalImages', files: FileList | null) => {
//     if (!files) return;
//     if (field === 'mainImage') {
//       setFormData(prev => ({ ...prev, mainImage: files[0] }));
//     } else {
//       setFormData(prev => ({ ...prev, [field]: Array.from(files) }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       await apiService.updateProductInfo(productId, formData);
//       setMessage('Product updated successfully!');
//     } catch (error) {
//       console.error('Error updating product:', error);
//       setMessage('Error updating product');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-xl">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
//           <p className="text-gray-600 mt-2">Update your product details and settings</p>
//         </div>

//         {message && (
//           <div className={`mb-6 p-4 rounded-md ${
//             message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
//           }`}>
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Basic Information */}
//           <div className="bg-white shadow rounded-lg">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
//                 <div className="font-semibold text-gray-900">{formData.name}</div>
//                 <div className="text-gray-600 text-sm">- {formData.category}</div>
//                 <div className="text-gray-700 mt-1 text-sm">{formData.description}</div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Product Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a category</option>
//                     {categories.map(category => (
//                       <option key={category.id} value={category.name}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="border-t border-gray-300"></div>

//           {/* Product Details */}
//           <div className="bg-white shadow rounded-lg">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
//             </div>
//             <div className="p-6 space-y-6">
//               <div className="text-gray-700 space-y-2">
//                 {formData.details.split('\n').map((paragraph, index) => (
//                   <p key={index}>{paragraph}</p>
//                 ))}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Details
//                 </label>
//                 <textarea
//                   name="details"
//                   value={formData.details}
//                   onChange={handleInputChange}
//                   rows={6}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Sizes
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.size.join(', ')}
//                     onChange={(e) => handleSizeChange(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="180, 210, 240, 280, 320"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Moisture
//                   </label>
//                   <input
//                     type="text"
//                     name="moisture"
//                     value={formData.moisture}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Admixture
//                   </label>
//                   <input
//                     type="text"
//                     name="admixture"
//                     value={formData.admixture}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Erosion Material
//                   </label>
//                   <input
//                     type="text"
//                     name="erosionMaterial"
//                     value={formData.erosionMaterial}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Packaging
//                   </label>
//                   <input
//                     type="text"
//                     name="packaging"
//                     value={formData.packaging}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Jute Capacity
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.capacity.jute}
//                     onChange={(e) => handleCapacityChange('jute', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Vacuum Capacity
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.capacity.vacuum}
//                     onChange={(e) => handleCapacityChange('vacuum', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Images Section */}
//           <div className="bg-white shadow rounded-lg">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-900">Images</h2>
//             </div>
//             <div className="p-6 space-y-8">
//               {/* Main Image */}
//               <div>
//                 <h3 className="text-md font-medium text-gray-900 mb-4">Main Image</h3>
//                 <div className="flex items-center space-x-4">
//                   <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
//                     <span className="text-gray-500">Product Image</span>
//                   </div>
//                   <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
//                     Change Image
//                     <input
//                       type="file"
//                       className="hidden"
//                       onChange={(e) => handleFileChange('mainImage', e.target.files)}
//                       accept="image/*"
//                     />
//                   </label>
//                 </div>
//               </div>

//               {/* Gallery Images */}
//               <div>
//                 <h3 className="text-md font-medium text-gray-900 mb-4">Gallery Images</h3>
//                 <div className="space-y-4">
//                   <div className="flex flex-wrap gap-4">
//                     {[1, 2, 3].map((item) => (
//                       <div key={item} className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
//                         <span className="text-gray-500 text-sm">Image {item}</span>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
//                       Choose Files
//                       <input
//                         type="file"
//                         multiple
//                         className="hidden"
//                         onChange={(e) => handleFileChange('galleryImages', e.target.files)}
//                         accept="image/*"
//                       />
//                     </label>
//                     <span className="text-sm text-gray-500">No file chosen</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Additional Images */}
//               <div>
//                 <h3 className="text-md font-medium text-gray-900 mb-4">Additional Images</h3>
//                 <div className="space-y-4">
//                   <div className="flex flex-wrap gap-4">
//                     {[1, 2].map((item) => (
//                       <div key={item} className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
//                         <span className="text-gray-500 text-sm">Additional {item}</span>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
//                       Choose Files
//                       <input
//                         type="file"
//                         multiple
//                         className="hidden"
//                         onChange={(e) => handleFileChange('additionalImages', e.target.files)}
//                         accept="image/*"
//                       />
//                     </label>
//                     <span className="text-sm text-gray-500">No file chosen</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Highlights & Features */}
//           <div className="bg-white shadow rounded-lg">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-900">Highlights & Features</h2>
//             </div>
//             <div className="p-6 space-y-8">
//               {/* Product Highlights */}
//               <div>
//                 <h3 className="text-md font-medium text-gray-900 mb-4">Product Highlights</h3>
//                 <div className="space-y-3">
//                   {formData.highlights.map((highlight, index) => (
//                     <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
//                       <span className="text-gray-700">"{highlight}"</span>
//                       <button
//                         type="button"
//                         onClick={() => removeHighlight(index)}
//                         className="text-red-600 hover:text-red-800 text-sm font-medium"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                   <div className="flex space-x-2">
//                     <input
//                       type="text"
//                       value={newHighlight}
//                       onChange={(e) => setNewHighlight(e.target.value)}
//                       placeholder="Add new highlight..."
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       type="button"
//                       onClick={addHighlight}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       + Add Highlight
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Product Features */}
//               <div>
//                 <h3 className="text-md font-medium text-gray-900 mb-4">Product Features</h3>
//                 <div className="space-y-3">
//                   {formData.features.map((feature, index) => (
//                     <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
//                       <span className="text-gray-700">"{feature}"</span>
//                       <button
//                         type="button"
//                         onClick={() => removeFeature(index)}
//                         className="text-red-600 hover:text-red-800 text-sm font-medium"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                   <div className="flex space-x-2">
//                     <input
//                       type="text"
//                       value={newFeature}
//                       onChange={(e) => setNewFeature(e.target.value)}
//                       placeholder="Add new feature..."
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       type="button"
//                       onClick={addFeature}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       + Add Feature
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end pt-6">
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
//             >
//               {saving ? 'Updating Product...' : 'Update Product'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }