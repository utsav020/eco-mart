// // app/products/edit/[id]/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Product,
//   Category,
//   UpdateProductRequest,
//   ProductVariant,
//   ProductImage,
// } from "../../types/product";
// import { productApi } from "../../lib/api";

// export default function EditProductPage() {
//   const params = useParams();
//   const router = useRouter();
//   const productId = parseInt(params.id as string);

//   const [product, setProduct] = useState<Product | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [uploadingImages, setUploadingImages] = useState<string[]>([]);

//   useEffect(() => {
//     loadData();
//   }, [productId]);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const [productData, categoriesData] = await Promise.all([
//         productApi.getProductById(productId),
//         productApi.getAllCategories(),
//       ]);
      
//       // Ensure productImages and variants are always arrays
//       const safeProductData = {
//         ...productData,
//         productImages: productData.productImages || [],
//         variants: productData.variants || []
//       };
      
//       setProduct(safeProductData);
//       setCategories(categoriesData);
//     } catch (err: any) {
//       setError(`Failed to load product data: ${err.message}`);
//       console.error("Error loading data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!product) return;

//     try {
//       setSaving(true);
//       setError('');
//       setSuccess('');

//       // Safely get main and additional images
//       const productImages = product.productImages || [];
//       const mainImage = productImages.find(img => img.is_main === 1);
//       const additionalImages = productImages.filter(img => img.is_main !== 1);

//       const updateData: any = {
//         category_id: product.category_id,
//         productName: product.productName.trim(),
//         description: product.description.trim(),
//         has_variants: product.has_variants,
//         regularPrice: product.regularPrice || null,
//         salePrice: product.salePrice || null,
//         weights: product.weights || null,
//         quantity: product.quantity || null,
//         productImages: {
//           mainImage: mainImage?.image_url || '',
//           additionalImages: additionalImages.map(img => img.image_url)
//         }
//       };

//       // Include variants data if product has variants
//       const variants = product.variants || [];
//       if (product.has_variants === 1 && variants.length > 0) {
//         updateData.variants = variants.map(variant => ({
//           product_variant_id: variant.product_variant_id > 0 ? variant.product_variant_id : undefined,
//           productVariantName: variant.productVariantName.trim(),
//           regularPrice: variant.regularPrice || "0",
//           salePrice: variant.salePrice || "0",
//           weights: variant.weights || "",
//           quantity: variant.quantity || 0,
//           is_default: variant.is_default || 0
//         }));
//       } else {
//         updateData.variants = [];
//       }

//       console.log('🟢 Final update data:', JSON.stringify(updateData, null, 2));

//       const response = await productApi.updateProduct(productId, updateData);
      
//       setSuccess('Product updated successfully! Redirecting...');
      
//       setTimeout(() => {
//         router.push('/products');
//       }, 1500);
      
//     } catch (err: any) {
//       const errorMessage = err.message || 'Failed to update product';
//       setError(errorMessage);
//       console.error('❌ Error updating product:', err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     if (!product) return;

//     const { name, value } = e.target;
//     setProduct((prev) =>
//       prev
//         ? {
//             ...prev,
//             [name]:
//               name === "category_id" || name === "has_variants" || name === "quantity"
//                 ? value === "" ? null : parseInt(value)
//                 : value,
//           }
//         : null
//     );
//   };

//   const handleVariantChange = (index: number, field: string, value: string) => {
//     if (!product) return;

//     setProduct((prev) => {
//       if (!prev) return null;

//       const updatedVariants = [...(prev.variants || [])];
//       updatedVariants[index] = {
//         ...updatedVariants[index],
//         [field]:
//           field === "quantity" || field === "is_default"
//             ? value === "" ? 0 : parseInt(value)
//             : value,
//       };

//       return {
//         ...prev,
//         variants: updatedVariants,
//       };
//     });
//   };

//   // Image handling functions
//   const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!product || !e.target.files?.[0]) return;

//     const file = e.target.files[0];
//     const fileName = `main-${Date.now()}-${file.name}`;
    
//     try {
//       setUploadingImages(prev => [...prev, fileName]);
      
//       // In a real application, you would upload the file to your server here
//       // For now, we'll create a blob URL for preview
//       const imageUrl = URL.createObjectURL(file);
      
//       setProduct(prev => {
//         if (!prev) return null;

//         const currentImages = prev.productImages || [];
        
//         // Remove existing main image flag from all images
//         const updatedImages = currentImages.map(img => ({
//           ...img,
//           is_main: 0
//         }));

//         // Add new main image
//         const newMainImage: ProductImage = {
//           image_id: Date.now(),
//           image_url: imageUrl,
//           is_main: 1
//         };

//         return {
//           ...prev,
//           productImages: [newMainImage, ...updatedImages]
//         };
//       });

//     } catch (error) {
//       console.error('Error uploading main image:', error);
//       setError('Failed to upload main image');
//     } finally {
//       setUploadingImages(prev => prev.filter(name => name !== fileName));
//     }
//   };

//   const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!product || !e.target.files) return;

//     const files = Array.from(e.target.files);
//     const newImages: ProductImage[] = [];

//     try {
//       for (const file of files) {
//         const fileName = `additional-${Date.now()}-${file.name}`;
//         setUploadingImages(prev => [...prev, fileName]);
        
//         // In a real application, you would upload the file to your server here
//         // For now, we'll create a blob URL for preview
//         const imageUrl = URL.createObjectURL(file);
        
//         newImages.push({
//           image_id: Date.now() + Math.random(),
//           image_url: imageUrl,
//           is_main: 0
//         });

//         setUploadingImages(prev => prev.filter(name => name !== fileName));
//       }

//       setProduct(prev => prev ? {
//         ...prev,
//         productImages: [...(prev.productImages || []), ...newImages]
//       } : null);

//     } catch (error) {
//       console.error('Error uploading additional images:', error);
//       setError('Failed to upload additional images');
//     }
//   };

//   const setAsMainImage = (imageId: number) => {
//     if (!product) return;

//     setProduct(prev => {
//       if (!prev) return null;

//       const currentImages = prev.productImages || [];
//       const updatedImages = currentImages.map(img => ({
//         ...img,
//         is_main: img.image_id === imageId ? 1 : 0
//       }));

//       return {
//         ...prev,
//         productImages: updatedImages
//       };
//     });
//   };

//   const removeImage = (imageId: number) => {
//     if (!product) return;

//     setProduct(prev => prev ? {
//       ...prev,
//       productImages: (prev.productImages || []).filter(img => img.image_id !== imageId)
//     } : null);
//   };

//   const addNewVariant = () => {
//     if (!product) return;

//     const variants = product.variants || [];
//     const newVariant: ProductVariant = {
//       product_variant_id: -Date.now(),
//       productVariantName: `New Variant ${variants.length + 1}`,
//       regularPrice: "0",
//       salePrice: "0",
//       weights: "",
//       quantity: 0,
//       is_default: variants.length === 0 ? 1 : 0,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       variantImages: [],
//     };

//     setProduct((prev) =>
//       prev ? { 
//         ...prev, 
//         variants: [...(prev.variants || []), newVariant] 
//       } : null
//     );
//   };

//   const removeVariant = (index: number) => {
//     if (!product) return;

//     setProduct((prev) =>
//       prev ? { 
//         ...prev, 
//         variants: (prev.variants || []).filter((_, i) => i !== index) 
//       } : null
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-red-600 text-xl">Product not found</div>
//       </div>
//     );
//   }

//   // Safe access to product images
//   const productImages = product.productImages || [];
//   const mainImage = productImages.find(img => img.is_main === 1);
//   const additionalImages = productImages.filter(img => img.is_main !== 1);
//   const variants = product.variants || [];

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-8">
//           <button
//             onClick={() => router.back()}
//             className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center transition-colors"
//           >
//             ← Back to Products
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Edit Product #{productId}
//           </h1>
//           <p className="text-gray-600">
//             Update product information, images, and variants
//           </p>
//         </div>

//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <strong className="font-bold">Error: </strong>
//                 <span className="block mt-1 text-sm">{error}</span>
//               </div>
//               <button
//                 onClick={() => setError("")}
//                 className="ml-4 text-red-900 hover:text-red-700 text-lg"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
//             <strong className="font-bold">Success: </strong>
//             {success}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg overflow-hidden">
//           {/* Product Images Section */}
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold mb-6 text-gray-800">Product Images</h2>
            
//             {/* Main Image Section */}
//             <div className="mb-8">
//               <h3 className="text-lg font-medium text-gray-700 mb-4">Main Product Image</h3>
//               <div className="flex flex-col md:flex-row gap-6">
//                 <div className="flex-1">
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
//                     {mainImage ? (
//                       <div className="relative">
//                         <img
//                           src={mainImage.image_url}
//                           alt="Main product"
//                           className="w-full h-64 object-cover rounded-lg mx-auto"
//                         />
//                         <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
//                           Main Image
//                         </div>
//                         <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
//                           Primary
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="py-12">
//                         <div className="text-gray-400 mb-2">
//                           <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                         </div>
//                         <p className="text-gray-500 mb-2 text-lg">No main image set</p>
//                         {/* <p className="text-gray-400 text-sm">This will be the primary image displayed for your product</p> */}
//                       </div>
//                     )}
                    
//                     <label className="mt-4 cursor-pointer inline-block">
//                       <span className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
//                         {mainImage ? 'Change Main Image' : 'Upload Main Image'}
//                       </span>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleMainImageUpload}
//                         className="hidden"
//                       />
//                     </label>
//                     {/* <p className="text-xs text-gray-500 mt-3">
//                       Recommended: 800x800px, JPG, PNG or WebP format. Max 5MB.
//                     </p> */}
//                   </div>
//                 </div>
                
//                 {/* Main Image Instructions */}
//                 {/* <div className="md:w-80">
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <h4 className="font-medium text-blue-900 mb-2">About Main Image</h4>
//                     <ul className="text-sm text-blue-700 space-y-1">
//                       <li>• This is the primary product image</li>
//                       <li>• Displayed in product listings</li>
//                       <li>• Should be high quality and clear</li>
//                       <li>• Square aspect ratio works best</li>
//                       <li>• Show the product from its best angle</li>
//                     </ul>
//                   </div>
//                 </div> */}
//               </div>
//             </div>

//             {/* Additional Images Section */}
//             <div>
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-700">Additional Images</h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Show different angles, details, or variations of your product
//                   </p>
//                 </div>
//                 <label className="cursor-pointer">
//                   <span className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-block text-sm font-medium">
//                     + Add Images
//                   </span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleAdditionalImageUpload}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {additionalImages.length === 0 ? (
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
//                   <div className="text-gray-400 mb-3">
//                     <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                   </div>
//                   <p className="text-gray-500 text-lg mb-2">No additional images</p>
//                   <p className="text-gray-400 text-sm">Add multiple images to showcase different views of your product</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                   {additionalImages.map((image, index) => (
//                     <div key={image.image_id} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white">
//                       <img
//                         src={image.image_url}
//                         alt={`Additional product view ${index + 1}`}
//                         className="w-full h-32 object-cover"
//                       />
//                       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
//                         <div className="flex space-x-2">
//                           <button
//                             type="button"
//                             onClick={() => setAsMainImage(image.image_id)}
//                             className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
//                             title="Set as main image"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => removeImage(image.image_id)}
//                             className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors transform hover:scale-105"
//                             title="Remove image"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                       <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
//                         {index + 1}
//                       </div>
//                     </div>
//                   ))}
                  
//                   {/* Add More Images Card */}
//                   <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors flex flex-col items-center justify-center min-h-32">
//                     <div className="text-gray-400 mb-2">
//                       <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                       </svg>
//                     </div>
//                     <span className="text-sm text-gray-600 font-medium">Add More</span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={handleAdditionalImageUpload}
//                       className="hidden"
//                     />
//                   </label>
//                 </div>
//               )}
//             </div>

//             {/* Image Guidelines */}
//             {/* <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
//               <h4 className="font-medium text-gray-700 mb-2">Image Guidelines</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//                 <div>
//                   <ul className="space-y-1">
//                     <li>• Use high-quality, clear images</li>
//                     <li>• Square format recommended (1:1 ratio)</li>
//                     <li>• File types: JPG, PNG, WebP</li>
//                     <li>• Max file size: 5MB per image</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <ul className="space-y-1">
//                     <li>• Show product from multiple angles</li>
//                     <li>• Include close-ups of important details</li>
//                     <li>• Use natural lighting when possible</li>
//                     <li>• Keep background clean and simple</li>
//                   </ul>
//                 </div>
//               </div>
//             </div> */}

//             {/* Uploading Indicator */}
//             {uploadingImages.length > 0 && (
//               <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
//                     <p className="text-sm text-blue-700 font-medium">
//                       Uploading {uploadingImages.length} image(s)...
//                     </p>
//                   </div>
//                   <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
//                     Please wait
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Basic Information */}
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold mb-6 text-gray-800">Basic Information</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="productName"
//                   value={product.productName}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                   placeholder="Enter product name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category *
//                 </label>
//                 <select
//                   name="category_id"
//                   value={product.category_id}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((category) => (
//                     <option key={category.category_id} value={category.category_id}>
//                       {category.categoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Has Variants
//                 </label>
//                 <select
//                   name="has_variants"
//                   value={product.has_variants}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value={0}>No Variants</option>
//                   <option value={1}>Has Variants</option>
//                 </select>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {product.has_variants === 1 
//                     ? 'Product will use variant-specific pricing and inventory' 
//                     : 'Product will use main pricing and inventory'
//                   }
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 name="description"
//                 value={product.description}
//                 onChange={handleInputChange}
//                 rows={4}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Describe your product in detail..."
//                 required
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Include key features, specifications, and benefits of your product
//               </p>
//             </div>
//           </div>

//           {/* Main Product Pricing & Inventory */}
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold mb-6 text-gray-800">
//               {product.has_variants === 1 ? "Base Product Information" : "Pricing & Inventory"}
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Regular Price
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
//                   <input
//                     type="number"
//                     name="regularPrice"
//                     value={product.regularPrice || ""}
//                     onChange={handleInputChange}
//                     className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.00"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Sale Price
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
//                   <input
//                     type="number"
//                     name="salePrice"
//                     value={product.salePrice || ""}
//                     onChange={handleInputChange}
//                     className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.00"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Weight
//                 </label>
//                 <input
//                   type="text"
//                   name="weights"
//                   value={product.weights || ""}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="e.g., 500g, 1kg, 2lbs"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Quantity
//                 </label>
//                 <input
//                   type="number"
//                   name="quantity"
//                   value={product.quantity || ""}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="0"
//                   min="0"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Variants Section */}
//           {product.has_variants === 1 && (
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-800">Product Variants</h2>
//                   <p className="text-sm text-gray-600 mt-1">Manage different sizes, colors, or options</p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={addNewVariant}
//                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors font-medium"
//                 >
//                   + Add Variant
//                 </button>
//               </div>

//               {variants.length === 0 ? (
//                 <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
//                   <div className="text-gray-400 mb-3">
//                     <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                   </div>
//                   <p className="text-lg mb-2">No variants added</p>
//                   <p className="text-sm mb-4">Create variants for different product options</p>
//                   <button
//                     type="button"
//                     onClick={addNewVariant}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
//                   >
//                     Create First Variant
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   {variants.map((variant, index) => (
//                     <div
//                       key={variant.product_variant_id}
//                       className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm"
//                     >
//                       <div className="flex justify-between items-center mb-4">
//                         <div className="flex items-center space-x-3">
//                           <h3 className="text-lg font-medium text-gray-800">
//                             Variant {index + 1}
//                           </h3>
//                           {variant.is_default === 1 && (
//                             <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
//                               Default Variant
//                             </span>
//                           )}
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => removeVariant(index)}
//                           className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-colors font-medium"
//                         >
//                           Remove
//                         </button>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Variant Name *
//                           </label>
//                           <input
//                             type="text"
//                             value={variant.productVariantName}
//                             onChange={(e) => handleVariantChange(index, "productVariantName", e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="e.g., Large, Red, Cotton"
//                             required
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Regular Price *
//                           </label>
//                           <div className="relative">
//                             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
//                             <input
//                               type="number"
//                               value={variant.regularPrice}
//                               onChange={(e) => handleVariantChange(index, "regularPrice", e.target.value)}
//                               className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                               placeholder="0.00"
//                               min="0"
//                               step="0.01"
//                               required
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Sale Price *
//                           </label>
//                           <div className="relative">
//                             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
//                             <input
//                               type="number"
//                               value={variant.salePrice}
//                               onChange={(e) => handleVariantChange(index, "salePrice", e.target.value)}
//                               className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                               placeholder="0.00"
//                               min="0"
//                               step="0.01"
//                               required
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Weight
//                           </label>
//                           <input
//                             type="text"
//                             value={variant.weights}
//                             onChange={(e) => handleVariantChange(index, "weights", e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="e.g., 500g"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Quantity *
//                           </label>
//                           <input
//                             type="number"
//                             value={variant.quantity}
//                             onChange={(e) => handleVariantChange(index, "quantity", e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="0"
//                             min="0"
//                             required
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Is Default
//                           </label>
//                           <select
//                             value={variant.is_default}
//                             onChange={(e) => handleVariantChange(index, "is_default", e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           >
//                             <option value={0}>No</option>
//                             <option value={1}>Yes</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Form Actions */}
//           <div className="p-6 bg-gray-50">
//             <div className="flex justify-between items-center">
//               <button
//                 type="button"
//                 onClick={() => router.back()}
//                 className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
//                 disabled={saving}
//               >
//                 Cancel
//               </button>

//               <div className="flex space-x-4">
//                 <button
//                   type="button"
//                   onClick={loadData}
//                   className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
//                   disabled={saving}
//                 >
//                   Reset Changes
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
//                 >
//                   {saving ? (
//                     <span className="flex items-center">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Updating Product...
//                     </span>
//                   ) : (
//                     "Update Product"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }