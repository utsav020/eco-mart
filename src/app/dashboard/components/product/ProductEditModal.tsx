// "use client";

// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import {
//   X,
//   Upload,
//   TextAlignStart,
//   Edit3,
//   AlertCircle,
//   ImageIcon,
//   Layers,
//   FileText,
// } from "lucide-react";
// import { API_BASE_URL } from "@/lib/api";

// interface Variant {
//   product_category_id: number;
//   productCategoryName: string;
//   regularPrice: string | number;
//   salePrice: string | number;
//   weights: string;
//   quantity: number;
// }

// interface Product {
//   product_id: number;
//   productName: string;
//   regularPrice: string | number | null;
//   salePrice: string | number | null;
//   weights: string | null;
//   quantity: string | number | null;
//   description: string;
//   productImage?: string;
//   galleryImages?: string[];
//   additionalImages?: string[];
//   details?: string[];
//   highlights?: string[];
//   features?: string[];
//   variants?: Variant[];
// }

// interface Props {
//   product: Product;
//   onClose: () => void;
//   onUpdate: () => void;
// }

// const ProductEditModal: React.FC<Props> = ({ product, onClose, onUpdate }) => {
//   const router = useRouter();

//   const [formData, setFormData] = useState<Product>({
//     ...product,
//     regularPrice: product.regularPrice ?? "",
//     salePrice: product.salePrice ?? "",
//     weights: product.weights ?? "",
//     quantity: product.quantity ?? "",
//     details: product.details ?? [""],
//     highlights: product.highlights ?? [""],
//     features: product.features ?? [""],
//     galleryImages: product.galleryImages ?? [],
//     additionalImages: product.additionalImages ?? [],
//     variants: product.variants?.map((v) => ({
//       ...v,
//       regularPrice: v.regularPrice ?? "",
//       salePrice: v.salePrice ?? "",
//       quantity: v.quantity ?? 0,
//       weights: v.weights ?? "",
//       productCategoryName: v.productCategoryName ?? "",
//     })),
//   });

//   const [previewImage, setPreviewImage] = useState<string | null>(
//     product.productImage ?? null
//   );
//   const [newImageFile, setNewImageFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [activeTab, setActiveTab] = useState<"basic" | "variants">("basic");
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   // Validation
//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.productName.trim()) newErrors.productName = "Product name is required";
//     if (formData.regularPrice !== "" && Number(formData.regularPrice) < 0)
//       newErrors.regularPrice = "Price cannot be negative";
//     if (formData.salePrice !== "" && Number(formData.salePrice) < 0)
//       newErrors.salePrice = "Sale price cannot be negative";
//     if (formData.quantity !== "" && Number(formData.quantity) < 0)
//       newErrors.quantity = "Quantity cannot be negative";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Input Handlers
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     let newValue: any = value;
//     if (type === "number") newValue = value === "" ? "" : parseFloat(value);
//     setFormData({ ...formData, [name]: newValue });
//     if (errors[name]) setErrors({ ...errors, [name]: "" });
//   };

//   const handleVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!formData.variants) return;
//     const { name, value, type } = e.target;
//     const updatedVariants = [...formData.variants];
//     updatedVariants[index] = {
//       ...updatedVariants[index],
//       [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
//     };
//     setFormData({ ...formData, variants: updatedVariants });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setNewImageFile(file);
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const handleMultiImageChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     type: "galleryImages" | "additionalImages"
//   ) => {
//     const files = e.target.files;
//     if (!files) return;
//     const newImages = Array.from(files).map((f) => URL.createObjectURL(f));
//     setFormData({ ...formData, [type]: [...(formData[type] ?? []), ...newImages] });
//   };

//   const removeMultiImage = (type: "galleryImages" | "additionalImages", idx: number) => {
//     const newList = [...(formData[type] ?? [])];
//     newList.splice(idx, 1);
//     setFormData({ ...formData, [type]: newList });
//   };

//   const handleArrayChange = (type: "details" | "highlights" | "features", idx: number, value: string) => {
//     const arr = [...(formData[type] ?? [])];
//     arr[idx] = value;
//     setFormData({ ...formData, [type]: arr });
//   };

//   const addArrayItem = (type: "details" | "highlights" | "features") => {
//     setFormData({ ...formData, [type]: [...(formData[type] ?? []), ""] });
//   };

//   const removeArrayItem = (type: "details" | "highlights" | "features", idx: number) => {
//     const arr = [...(formData[type] ?? [])];
//     arr.splice(idx, 1);
//     setFormData({ ...formData, [type]: arr });
//   };

//   // Save
//   const handleSave = async () => {
//     if (!validateForm()) return;
//     try {
//       setLoading(true);
//       const data = new FormData();
//       data.append("productName", formData.productName);
//       data.append("regularPrice", String(formData.regularPrice ?? ""));
//       data.append("salePrice", String(formData.salePrice ?? ""));
//       data.append("weights", String(formData.weights ?? ""));
//       data.append("quantity", String(formData.quantity ?? ""));
//       data.append("description", formData.description ?? "");
//       data.append("details", JSON.stringify(formData.details ?? []));
//       data.append("highlights", JSON.stringify(formData.highlights ?? []));
//       data.append("features", JSON.stringify(formData.features ?? []));
//       if (newImageFile) data.append("productImage", newImageFile);
//       if (formData.galleryImages) data.append("galleryImages", JSON.stringify(formData.galleryImages));
//       if (formData.additionalImages)
//         data.append("additionalImages", JSON.stringify(formData.additionalImages));
//       if (formData.variants) data.append("variants", JSON.stringify(formData.variants));

//       await axios.put(
//         `${API_BASE_URL}/api/product/updateproduct/${product.product_id}`,
//         data,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setSaveSuccess(true);
//       setTimeout(() => {
//         onUpdate();
//         onClose();
//       }, 1500);
//     } catch (err) {
//       console.error(err);
//       setErrors({ submit: "Failed to update product. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Components
//   const InputField = ({
//     label,
//     name,
//     value,
//     onChange,
//     type = "text",
//     error,
//     placeholder,
//     min,
//     step,
//   }: {
//     label: string;
//     name: string;
//     value: any;
//     onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
//     type?: string;
//     error?: string;
//     placeholder?: string;
//     min?: number;
//     step?: string;
//   }) => (
//     <div className="space-y-2">
//       <label className="block text-md font-medium text-gray-700">
//         {label} {error && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <input
//         type={type}
//         name={name}
//         value={value ?? ""}
//         onChange={onChange}
//         placeholder={placeholder}
//         min={min}
//         step={step}
//         className={`w-full border rounded-lg px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
//           error
//             ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
//             : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
//         }`}
//       />
//       {error && (
//         <p className="text-red-600 text-md flex items-center gap-1 mt-1">
//           <AlertCircle size={14} /> {error}
//         </p>
//       )}
//     </div>
//   );

//   const ImageUploadSection = ({
//     title,
//     type,
//     images,
//     onUpload,
//     onRemove,
//     description,
//   }: {
//     title: string;
//     type: "main" | "gallery" | "additional";
//     images: string | string[];
//     onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     onRemove: (idx?: number) => void;
//     description?: string;
//   }) => {
//     const fileInputRef = useRef<HTMLInputElement | null>(null);

//     return (
//       <div className="bg-white h-[400px] p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
//         <div className="flex h-[45px] gap-2 mb-3">
//           <div className="mt-4">
//             <ImageIcon size={18} className="text-green-600" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-800 text-[10px]">{title}</h3>
//           </div>
//         </div>

//         <div className="h-[200px] mb-4">
//           {type === "main" ? (
//             images ? (
//               <div className="relative inline-block group">
//                 <img
//                   src={images as string}
//                   className="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-sm"
//                   alt="Main product"
//                 />
//                 <button
//                   onClick={() => onRemove()}
//                   className="absolute -top-2 -right-0 left-12 text-white rounded-full w-6 h-6 flex items-center justify-center text-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
//                 >
//                   <X />
//                 </button>
//               </div>
//             ) : (
//               <div className="w-full h-[230px] rounded-lg flex items-center justify-center text-gray-400">
//                 No Image
//               </div>
//             )
//           ) : (
//             <div className="flex flex-wrap gap-3">
//               {(images as string[]).map((src, idx) => (
//                 <div key={idx} className="relative group">
//                   <img
//                     src={src}
//                     className="w-full object-cover rounded-lg border-2 border-gray-200 shadow-sm"
//                     alt={`Gallery ${idx + 1}`}
//                   />
//                   <button
//                     onClick={() => onRemove(idx)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-md"
//                   >
//                     <X />
//                   </button>
//                 </div>
//               ))}
//               {(images as string[]).length === 0 && (
//                 <div className="w-full h-[230px] rounded-lg flex items-center justify-center text-gray-400 text-md">
//                   No Images
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div
//           onClick={() => fileInputRef.current?.click()}
//           className="w-auto h-[45px] rounded-lg p-4 text-center hover:bg-green-50 transition-all duration-200 cursor-pointer group"
//         >
//           <div className="flex items-center justify-center gap-2 text-green-600">
//             <Upload size={20} className="group-hover:scale-110 transition-transform" />
//             <span className="text-md font-medium">
//               {type === "main" ? "Upload Main Image" : "Upload Multiple Images"}
//             </span>
//           </div>
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={onUpload}
//             multiple={type !== "main"}
//             className="hidden"
//             accept="image/*"
//           />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-[700px] w-full mx-auto flex flex-col max-h-[95vh]">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200 rounded-t-2xl flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <Edit3 size={24} className="text-blue-600" />
//             </div>
//             <div>
//               <h2 className="font-bold text-gray-800 text-2xl">Edit Product</h2>
//               <p className="text-md text-gray-600 mt-1">Update product details, images and variants</p>
//             </div>
//           </div>
//           <div>
//             <button
//               className="p-2 hover:bg-white rounded-lg text-gray-500 transition-all duration-200 hover:shadow-md hover:text-gray-700"
//               onClick={onClose}
//               disabled={loading}
//             >
//               <X size={24} />
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {errors.submit && (
//             <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
//               <AlertCircle size={18} /> {errors.submit}
//             </div>
//           )}
//           {saveSuccess && (
//             <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Product updated successfully
//             </div>
//           )}

//           {/* Main + Additional Images */}
//           <div className="grid lg:grid-cols-2 gap-6">
//             <ImageUploadSection
//               title="Main Image"
//               type="main"
//               images={previewImage ?? ""}
//               onUpload={handleImageChange}
//               onRemove={() => setPreviewImage(null)}
//             />
//             <ImageUploadSection
//               title="Additional Images"
//               type="additional"
//               images={formData.additionalImages ?? []}
//               onUpload={(e) => handleMultiImageChange(e, "additionalImages")}
//               onRemove={(idx) => removeMultiImage("additionalImages", idx)}
//             />
//           </div>

//           {/* Tabs */}
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//             <div className="flex border-b border-gray-200 bg-gray-50">
//               <button
//                 onClick={() => setActiveTab("basic")}
//                 className={`flex items-center gap-2 flex-1 py-4 px-6 font-medium transition-all duration-200 ${
//                   activeTab === "basic"
//                     ? "text-blue-600 border-b-2 border-blue-500 bg-white shadow-sm"
//                     : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
//                 }`}
//               >
//                 <FileText size={18} /> Basic Information
//               </button>
//               {formData.variants && formData.variants.length > 0 && (
//                 <button
//                   onClick={() => setActiveTab("variants")}
//                   className={`flex items-center gap-2 flex-1 py-4 px-6 font-medium transition-all duration-200 ${
//                     activeTab === "variants"
//                       ? "text-purple-600 border-b-2 border-purple-500 bg-white shadow-sm"
//                       : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Layers size={18} /> Variants ({formData.variants.length})
//                 </button>
//               )}
//             </div>

//             <div className="p-6">
//               {/* Basic Info */}
//               {activeTab === "basic" && (
//                 <div className="space-y-6">
//                   <InputField
//                     label="Product Name"
//                     name="productName"
//                     value={formData.productName}
//                     onChange={handleChange}
//                     placeholder="Enter product name"
//                     error={errors.productName}
//                   />
//                   <div className="space-y-2">
//                     <label className="block text-md font-medium text-gray-700">Description</label>
//                     <textarea
//                       name="description"
//                       value={formData.description ?? ""}
//                       onChange={handleChange}
//                       rows={4}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
//                       placeholder="Enter product description..."
//                     />
//                   </div>

//                   <div className="grid lg:grid-cols-2 gap-6">
//                     <InputField
//                       label="Regular Price ($)"
//                       name="regularPrice"
//                       type="text"
//                       value={formData.regularPrice}
//                       onChange={handleChange}
//                       placeholder="0.00"
//                       step="0.01"
//                       error={errors.regularPrice}
//                     />
//                     <InputField
//                       label="Sale Price ($)"
//                       name="salePrice"
//                       type="number"
//                       value={formData.salePrice}
//                       onChange={handleChange}
//                       placeholder="0.00"
//                       step="0.01"
//                       error={errors.salePrice}
//                     />
//                   </div>

//                   <div className="grid lg:grid-cols-2 gap-6">
//                     <InputField
//                       label="Weight"
//                       name="weights"
//                       value={formData.weights}
//                       onChange={handleChange}
//                       placeholder="e.g., 500g, 1kg"
//                     />
//                     <InputField
//                       label="Quantity"
//                       name="quantity"
//                       type="number"
//                       value={formData.quantity}
//                       onChange={handleChange}
//                       placeholder="0"
//                       error={errors.quantity}
//                     />
//                   </div>

//                   {/* Details */}
//                   <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
//                     <div className="flex justify-between items-center mb-4">
//                       <h4 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
//                         <TextAlignStart size={18} /> Product Details
//                       </h4>
//                       <button
//                         onClick={() => addArrayItem("details")}
//                         className="bg-blue-500 text-black px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-bold text-md"
//                       >
//                         + Add Detail
//                       </button>
//                     </div>
//                     {formData.details?.map((detail, idx) => (
//                       <div key={idx} className="flex items-center gap-2 mb-2 group">
//                         <textarea
//                           value={detail}
//                           onChange={(e) => handleArrayChange("details", idx, e.target.value)}
//                           className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                           placeholder="Enter detail..."
//                           rows={2}
//                         />
//                         <button
//                           onClick={() => removeArrayItem("details", idx)}
//                           className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
//                         >
//                           <X />
//                         </button>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Highlights & Features */}
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div className="bg-green-50 p-5 rounded-xl border border-green-100">
//                       <div className="flex justify-between mb-4">
//                         <h4 className="font-semibold text-gray-800 text-lg">Highlights</h4>
//                         <button
//                           onClick={() => addArrayItem("highlights")}
//                           className="bg-green-500 text-black font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors text-md"
//                         >
//                           + Add
//                         </button>
//                       </div>
//                       {formData.highlights?.map((item, idx) => (
//                         <div key={idx} className="flex items-center gap-2 mb-2 group">
//                           <input
//                             type="text"
//                             value={item}
//                             onChange={(e) => handleArrayChange("highlights", idx, e.target.value)}
//                             className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
//                             placeholder="Enter highlight..."
//                           />
//                           <button
//                             onClick={() => removeArrayItem("highlights", idx)}
//                             className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
//                           >
//                             <X />
//                           </button>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
//                       <div className="flex justify-between mb-4">
//                         <h4 className="font-semibold text-gray-800 text-lg">Features</h4>
//                         <button
//                           onClick={() => addArrayItem("features")}
//                           className="bg-purple-500 text-black px-3 py-1.5 rounded-lg hover:bg-purple-600 transition-colors font-bold text-md"
//                         >
//                           + Add
//                         </button>
//                       </div>
//                       {formData.features?.map((item, idx) => (
//                         <div key={idx} className="flex items-center gap-2 mb-2 group">
//                           <input
//                             type="text"
//                             value={item}
//                             onChange={(e) => handleArrayChange("features", idx, e.target.value)}
//                             className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
//                             placeholder="Enter feature..."
//                           />
//                           <button
//                             onClick={() => removeArrayItem("features", idx)}
//                             className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
//                           >
//                             <X />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Variants Tab */}
//               {activeTab === "variants" && formData.variants && (
//                 <div className="space-y-4">
//                   {formData.variants.map((variant, idx) => (
//                     <div
//                       key={variant.product_category_id}
//                       className="border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
//                     >
//                       <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
//                         <Layers size={18} /> Variant {idx + 1}{" "}
//                         <span className="text-md text-gray-500 font-normal ml-2">
//                           (ID: {variant.product_category_id})
//                         </span>
//                       </h4>
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                         <InputField
//                           label="Category Name"
//                           name="productCategoryName"
//                           value={variant.productCategoryName ?? ""}
//                           onChange={(e) => handleVariantChange(idx, e)}
//                           placeholder="Enter category name"
//                         />
//                         <InputField
//                           label="Weight"
//                           name="weights"
//                           value={variant.weights ?? ""}
//                           onChange={(e) => handleVariantChange(idx, e)}
//                           placeholder="e.g., 500g, 1kg"
//                         />
//                         <InputField
//                           label="Regular Price ($)"
//                           name="regularPrice"
//                           type="number"
//                           value={variant.regularPrice ?? ""}
//                           onChange={(e) => handleVariantChange(idx, e)}
//                           placeholder="0.00"
//                           step="0.01"
//                         />
//                         <InputField
//                           label="Sale Price ($)"
//                           name="salePrice"
//                           type="number"
//                           value={variant.salePrice ?? ""}
//                           onChange={(e) => handleVariantChange(idx, e)}
//                           placeholder="0.00"
//                           step="0.01"
//                         />
//                         <InputField
//                           label="Quantity"
//                           name="quantity"
//                           type="number"
//                           value={variant.quantity ?? ""}
//                           onChange={(e) => handleVariantChange(idx, e)}
//                           placeholder="0"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...
//               </>
//             ) : saveSuccess ? (
//               "Success!"
//             ) : (
//               "Update Product"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductEditModal;
