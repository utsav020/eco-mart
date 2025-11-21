// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import HeaderThree from "@/components/header/HeaderThree";
// import FooterTwo from "@/components/footer/FooterTwo";
// import { Minus, Plus } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useProduct } from "../../../components/context/page";
// import { useRouter, useParams } from "next/navigation";
// import { useCart } from "@/components/header/CartContext";

// interface ProductImage {
//   image_id: number;
//   image_url: string;
// }

// interface WeightOption {
//   value: string;
//   label: string;
//   price: number;
// }

// interface ProductType {
//   _id?: string;
//   product_id?: number;
//   category_id?: number;
//   productName: string;
//   regularPrice?: number | null;
//   salePrice?: number | null;
//   description?: string;
//   discription?: string; // included to match previous cart expectations
//   has_variants?: boolean | number;
//   productImages?: ProductImage[];
//   productWeight?: string;
//   weightOptions?: WeightOption[];
//   image?: string;
//   stock?: number;
//   [key: string]: any;
// }

// const CompareElements: React.FC = () => {
//   const { selectedProduct } = useProduct();
//   const router = useRouter();
//   const params = useParams();
//   const id = (params as { id?: string })?.id;
//   const { addToCart } = useCart();

//   const [product, setProduct] = useState<ProductType | null>(null);
//   const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
//   const [added, setAdded] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [activeImage, setActiveImage] = useState<string>("");
//   const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
//   const [displayPrice, setDisplayPrice] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState("tab1");
//   const [loading, setLoading] = useState<boolean>(true);

//   // Default thumbnails used when there are no product images
//   const defaultThumbnails: ProductImage[] = [
//     { image_id: 1, image_url: "/assets/images/shop/01.jpg" },
//     { image_id: 2, image_url: "/assets/images/shop/02.jpg" },
//     { image_id: 3, image_url: "/assets/images/shop/03.jpg" },
//     { image_id: 4, image_url: "/assets/images/shop/04.jpg" },
//   ];

//   // --- Load product: tries context -> localStorage -> API by id
//   useEffect(() => {
//     let mounted = true;
//     const fetchProduct = async () => {
//       try {
//         let loadedProduct: ProductType | null = null;

//         if (selectedProduct && Object.keys(selectedProduct).length) {
//           loadedProduct = selectedProduct;
//           localStorage.setItem(
//             "selectedProduct",
//             JSON.stringify(selectedProduct)
//           );
//         } else {
//           const saved = localStorage.getItem("selectedProduct");
//           if (saved) {
//             loadedProduct = JSON.parse(saved);
//           } else if (id) {
//             const res = await fetch(
//               `https://ekomart-backend.onrender.com/api/product/getproductbyid/${id}`
//             );
//             if (!res.ok) throw new Error("Failed to fetch product");
//             const data = await res.json();
//             loadedProduct = data;
//             localStorage.setItem("selectedProduct", JSON.stringify(data));
//           }
//         }

//         if (mounted && loadedProduct) {
//           // Normalize product images array
//           loadedProduct.productImages =
//             loadedProduct.productImages && loadedProduct.productImages.length
//               ? loadedProduct.productImages
//               : loadedProduct.productImages; // keep as-is or undefined

//           setProduct((prev) => {
//             // set default active image
//             const firstImage =
//               loadedProduct!.productImages?.[0]?.image_url ||
//               loadedProduct!.image ||
//               "/assets/images/placeholder.png";

//             setActiveImage(firstImage);
//             return loadedProduct;
//           });
//         }
//       } catch (err) {
//         console.error("Error loading product:", err);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchProduct();
//     return () => {
//       mounted = false;
//     };
//   }, [selectedProduct, id]);

//   // --- Fetch related products by category
//   useEffect(() => {
//     let mounted = true;
//     const fetchRelated = async () => {
//       if (!product?.category_id) return;
//       try {
//         const res = await fetch(
//           `https://ekomart-backend.onrender.com/api/product/getproductbycategory/${product.category_id}`
//         );
//         if (!res.ok) throw new Error("Failed to fetch related");
//         const data = await res.json();
//         const filtered = data.filter(
//           (item: ProductType) => item._id !== product._id
//         );
//         if (mounted) setRelatedProducts(filtered);
//       } catch (err) {
//         console.error("Error fetching related products:", err);
//       }
//     };
//     fetchRelated();

//     return () => {
//       mounted = false;
//     };
//   }, [product?.category_id, product?._id]);

//   // --- Initialize weight options and selected price
//   useEffect(() => {
//     if (!product) return;

//     // Build sensible weight options if none found
//     const baseSale =
//       Number(product.salePrice ?? product.regularPrice ?? 0) || 0;
//     const computedWeightOptions: WeightOption[] =
//       product.weightOptions && product.weightOptions.length
//         ? product.weightOptions
//         : [
//             {
//               value: "500g",
//               label: "500g",
//               price: Math.round(baseSale * 0.6) || baseSale,
//             },
//             {
//               value: "1kg",
//               label: "1kg",
//               price: Math.round(baseSale * 1) || baseSale,
//             },
//           ];

//     // update product with generated weightOptions (non-destructive)
//     setProduct((prev) =>
//       prev ? { ...prev, weightOptions: computedWeightOptions } : prev
//     );

//     // default selection
//     setSelectedWeight(computedWeightOptions[0].value);
//     setDisplayPrice(computedWeightOptions[0].price);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [product?._id]); // re-run when product changes

//   // When selectedWeight changes, update display price
//   useEffect(() => {
//     if (!product?.weightOptions || !selectedWeight) return;
//     const found = product.weightOptions.find((w) => w.value === selectedWeight);
//     if (found) setDisplayPrice(found.price);
//   }, [selectedWeight, product?.weightOptions]);

//   const thumbnails = useMemo(
//     () =>
//       product?.productImages && product.productImages.length
//         ? product.productImages
//         : defaultThumbnails,
//     [product?.productImages]
//   );

//   const increaseQuantity = () => setQuantity((q) => q + 1);
//   const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

//   const handleAdd = () => {
//     if (!product) return;

//     // Ensure price number and fallback
//     const priceNum = Number(
//       displayPrice ?? product.salePrice ?? product.regularPrice ?? 0
//     );

//     // Build cart item payload; include description & 'discription' to avoid earlier TS errors
//     const cartItem = {
//       id: product._id ?? String(Date.now()), // keep id as string if original _id is string
//       image: product.image || activeImage,
//       productName: product.productName,
//       price: priceNum,
//       quantity,
//       active: true,
//       regularPrice: product.regularPrice ?? product.salePrice ?? null,
//       productImage: product.image || activeImage || "",
//       title: product.productName,
//       description: product.description ?? "No description available",
//       discription: product.description ?? "No description available", // legacy spelling preserved
//       weight: selectedWeight,
//     };

//     try {
//       addToCart(cartItem as any); // your CartContext probably expects a certain shape
//       setAdded(true);
//       toast.success("🎉 Successfully Added To Cart!");
//       setTimeout(() => setAdded(false), 3000);
//     } catch (err) {
//       console.error("Add to cart failed:", err);
//       toast.error("Unable to add to cart. Try again.");
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-gray-500">Loading Product...</div>
//       </div>
//     );

//   if (!product)
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-6">
//         <p className="text-lg text-gray-600 mb-4">
//           No product data found. Please return to the shop.
//         </p>
//         <button
//           onClick={() => router.push("/")}
//           className="px-6 py-3 bg-[#077D40] text-white rounded-full"
//         >
//           Back to Shop
//         </button>
//       </div>
//     );

//   return (
//     <div className="min-h-screen">
//       <HeaderThree />

      // {/* Breadcrumb */}
      // <div className="bg-white py-3 sticky top-0 z-40">
      //   <div className="max-w-[1430px] mx-auto">
      //     <div className="flex items-center gap-3 text-sm md:text-base">
      //       <a href="/" className="text-gray-500 hover:text-green-600">
      //         Home
      //       </a>
      //       <span className="text-gray-300">/</span>
      //       <a href="/shop" className="text-gray-500 hover:text-green-600">
      //         Shop
      //       </a>
      //       <span className="text-gray-300">/</span>
      //       <span className="text-green-600 font-semibold truncate">
      //         {product.productName}
      //       </span>
      //     </div>
      //   </div>
      // </div>

//       {/* Main Product Section */}
//       <main className="max-w-[1430px] mx-auto py-8">
//         <div className="p-4 md:p-6 xl:p-0 rounded-lg">
//           <div className="grid grid-cols-1 lg:grid-cols-2 2xl:flex 2xl:gap-0  lg:gap-8">
//             {/* Images Column */}
//             <section className="w-[500px]">
//               {/* Large image */}
//               <div className="w-[500px] rounded-lg">
//                 <div className="aspect-square w-[500px]">
//                   <img
//                     src={activeImage}
//                     alt={product.productName}
//                     className="object-cover w-[500px] rounded-lg h-[500px] max-h-[500px]"
//                     onError={(e: any) =>
//                       (e.currentTarget.src = "/assets/images/placeholder.png")
//                     }
//                   />
//                 </div>
//               </div>

//               {/* Thumbnails (horizontal scroll on small screens) */}
//               <div className="mt-3">
//                 <div className="flex gap-3 overflow-x-auto py-2">
//                   {thumbnails.map((thumb) => (
//                     <button
//                       key={thumb.image_id}
//                       onClick={() => setActiveImage(thumb.image_url)}
//                       className={`shrink-0 rounded-lg overflow-hidden border transition-all duration-200 focus:outline-none ${
//                         activeImage === thumb.image_url
//                           ? "ring-2 ring-green-500 shadow-md"
//                           : "border-gray-200 hover:border-green-300"
//                       }`}
//                       style={{ width: 88, height: 88 }}
//                       aria-label={`Select image ${thumb.image_id}`}
//                     >
//                       <img
//                         src={thumb.image_url}
//                         alt={`${product.productName} thumbnail`}
//                         className="w-full h-full object-cover"
//                         onError={(e: any) =>
//                           (e.currentTarget.src =
//                             "/assets/images/placeholder.png")
//                         }
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </section>

//             {/* Info Column */}
//             <section className="flex max-w-[829px] xl:ml-[61px] flex-col">
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//                 {product.productName}
//               </h1>

//               <p className="mt-3 text-gray-600">{product.description}</p>

//               {/* Price */}
//               <div className="mt-4 flex items-baseline gap-4">
//                 <div className="text-2xl md:text-3xl font-extrabold text-[#077D40]">
//                   Rs.{" "}
//                   {displayPrice !== null
//                     ? displayPrice.toLocaleString()
//                     : product.salePrice ?? product.regularPrice ?? 0}
//                 </div>

//                 {product.regularPrice ? (
//                   <div className="text-sm md:text-base text-gray-400 line-through">
//                     Rs. {(product.regularPrice ?? 0).toLocaleString()}
//                   </div>
//                 ) : null}
//               </div>

//               {/* Weight Selector */}
//               <div className="flex flex-col h-[54px] mb-0 md:flex-row items-start md:items-end gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="">
//                     <p className="text-[16px] text-gray-900">Weight:</p>
//                   </div>
//                   <div className="flex text-[13px] border rounded-lg border-[#D9D9D9] w-[169px] h-[30px]">
//                     {["1kg", "500g"].map((weight) => (
//                       <button
//                         style={{ borderRadius: "8px" }}
//                         key={weight}
//                         onClick={() => setSelectedWeight(weight)}
//                         className={`rounded-xl font-semibold w-1/2 transition-all duration-200 ${
//                           selectedWeight === weight
//                             ? "text-white bg-[#077D40]"
//                             : "text-black"
//                         }`}
//                       >
//                         {weight}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Availability */}
//               <div className="mt-4">
//                 <span className="text-sm text-gray-600">Availability: </span>
//                 <span className="font-semibold text-[#077D40]">
//                   {product.stock && product.stock > 0
//                     ? "In Stock"
//                     : "Out of Stock"}
//                 </span>
//               </div>

//               {/* Quantity & Buttons */}
//               <div className="mt-6 flex flex-col sm:flex-row xl:flex-col sm:gap-6 gap-3">
//                 <div className="flex items-center gap-4">
//                   <div className="">
//                     <p>Quantity:</p>
//                   </div>

//                   <div className="flex items-center w-[101px] gap-3 bg-[#F3F3F3] rounded-lg">
//                     <div className="bg-[#C3C3C1] rounded-md w-[35px] h-[30px]">
//                       <button
//                         onClick={decreaseQuantity}
//                         disabled={quantity <= 1}
//                         className="p-2 rounded-md disabled:opacity-50"
//                         aria-label="Decrease quantity"
//                       >
//                         <Minus size={16} />
//                       </button>
//                     </div>

//                     <div className="min-w-3 text-center font-bold">
//                       {quantity}
//                     </div>

//                     <div className="bg-[#C3C3C1] rounded-md w-[35px] h-[30px]">
//                       <button
//                         onClick={increaseQuantity}
//                         className="p-2 rounded-md"
//                         aria-label="Increase quantity"
//                       >
//                         <Plus size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="md:flex gap-4">
//                   <div className="w-[332px]">
//                     <button
//                       onClick={handleAdd}
//                       className={`w-full px-4 py-3 font-bold transition ${
//                         added
//                           ? "bg-[#077D40] text-white"
//                           : "border border-gray-800 hover:bg-[#077D40] hover:text-white"
//                       }`}
//                       aria-pressed={added}
//                     >
//                       {added ? "Added to your Cart ✅" : "Add to cart"}
//                     </button>
//                   </div>

//                   <div className="w-[332px]">
//                     <button
//                       onClick={() => {
//                         // quick "Buy it now" flow: add to cart then navigate to checkout (example)
//                         handleAdd();
//                         router.push("/checkout");
//                       }}
//                       className="w-full px-4 py-3 bg-[#077D40] text-white font-bold"
//                     >
//                       Buy it now
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Accepted payments */}
//               <div className="mt-6 flex items-center justify-between max-w-sm">
//                 <div className="text-sm text-gray-600">Accepted Payments:</div>
//                 <div className="flex items-center gap-2">
//                   <img
//                     src="/assets/images/shop/Credit card1.png"
//                     className="h-6"
//                     alt="card"
//                   />
//                   <img
//                     src="/assets/images/shop/Credit card3.png"
//                     className="h-6"
//                     alt="card"
//                   />
//                   <img
//                     src="/assets/images/shop/Credit card.png"
//                     className="h-6"
//                     alt="card"
//                   />
//                   <img
//                     src="/assets/images/shop/Credit card2.png"
//                     className="h-6"
//                     alt="card"
//                   />
//                 </div>
//               </div>

//               {/* Tabs (mobile-friendly) */}
//               <div className="mt-8">
//                 <div className="flex gap-3 border-b pb-3 overflow-x-auto">
//                   <button
//                     onClick={() => setActiveTab("tab1")}
//                     className={`pb-2 font-semibold ${
//                       activeTab === "tab1"
//                         ? "text-green-600 border-b-2 border-green-500"
//                         : "text-gray-500"
//                     }`}
//                   >
//                     Product Details
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("tab2")}
//                     className={`pb-2 font-semibold ${
//                       activeTab === "tab2"
//                         ? "text-green-600 border-b-2 border-green-500"
//                         : "text-gray-500"
//                     }`}
//                   >
//                     Specifications
//                   </button>
//                 </div>

//                 <div className="mt-4 text-gray-700">
//                   {activeTab === "tab1" && (
//                     <div>
//                       <p>
//                         At <strong>Dadu Fresh</strong>, a brand by{" "}
//                         <strong>
//                           CSC Kalavad Farmer Producer Company Limited
//                         </strong>
//                         , we proudly bring you{" "}
//                         <strong>Organic Soyabeans</strong> – rich in plant-based
//                         protein and essential nutrients.
//                       </p>
//                       <p className="mt-2 text-sm text-gray-600">
//                         {product.description}
//                       </p>
//                     </div>
//                   )}

//                   {activeTab === "tab2" && (
//                     <div>
//                       <p className="text-sm text-gray-600">
//                         Organic Soyabeans are grown naturally without chemicals
//                         and are perfect for health-conscious families.
//                       </p>
//                       {/* You can map more specification rows here */}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>

//         {/* Related products placeholder (render if available) */}
//         {relatedProducts.length > 0 && (
//           <section className="mt-10">
//             <h2 className="text-xl font-bold mb-4">Related Products</h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {relatedProducts.slice(0, 8).map((rp) => (
//                 <article
//                   key={rp._id ?? rp.product_id}
//                   className="bg-white p-3 rounded-md flex flex-col items-start gap-2 border"
//                 >
//                   <img
//                     src={
//                       rp.image ||
//                       rp.productImages?.[0]?.image_url ||
//                       "/assets/images/placeholder.png"
//                     }
//                     alt={rp.productName}
//                     className="w-full h-32 object-cover rounded"
//                   />
//                   <h3 className="text-sm font-semibold mt-2 line-clamp-2">
//                     {rp.productName}
//                   </h3>
//                   <div className="text-sm text-gray-600">
//                     Rs.{" "}
//                     {(rp.salePrice ?? rp.regularPrice ?? 0).toLocaleString()}
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </section>
//         )}
//       </main>

//       <FooterTwo />
//       <ToastContainer position="bottom-right" autoClose={3000} />
//     </div>
//   );
// };

// export default CompareElements;


