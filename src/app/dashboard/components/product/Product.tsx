// // "use client";

// // import { API_BASE_URL } from "@/lib/api";
// // import axios from "axios";
// // import {
// //   Eye,
// //   SquarePen,
// //   Trash2,
// //   Search,
// //   Plus,
// //   Filter,
// // } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import React, { useState, useEffect } from "react";
// // import DataTable, { TableColumn } from "react-data-table-component";
// // import ProductViewModal from "./ProductViewModal";
// // import Loader from "../Loader"

// // interface Variant {
// //   product_category_id: number;
// //   productCategoryName: string;
// //   regularPrice: string;
// //   salePrice: string;
// //   weights: string;
// //   quantity: number;
// //   variantImages?: { image_id: number; image_url: string }[];
// // }

// // interface Product {
// //   product_id: number;
// //   category_id: number;
// //   productName: string;
// //   regularPrice: string | null;
// //   salePrice: string | null;
// //   weights: string | null;
// //   quantity: string | number | null;
// //   description: string;
// //   has_variants: number;
// //   productImages?: { image_id: number; image_url: string }[];
// //   variants?: Variant[];
// // }

// // interface TableRow {
// //   id: string;
// //   name: string;
// //   regularPrice: string | number | null;
// //   salePrice: string | number | null;
// //   quantity: string | number | null;
// //   categoryId: number;
// //   isVariant: boolean;
// //   status: string;
// // }

// // const ProductTable = () => {
// //   const [products, setProducts] = useState<Product[]>([]);
// //   const [filterText, setFilterText] = useState("");
// //   const [viewProduct, setViewProduct] = useState<Product | null>(null);
// //   const [selectedStatus, setSelectedStatus] = useState("all");
// //   const [isLoading, setIsLoading] = useState(true);
// //   const router = useRouter();

// //   // Fetch all products
// //   const fetchAllProducts = async () => {
// //     try {
// //       setIsLoading(true);
// //       const res = await axios.get(`${API_BASE_URL}/api/product/getallproducts`);
// //       setProducts(res.data || []);
// //     } catch (err) {
// //       console.error("Error fetching products:", err);
// //       setProducts([]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAllProducts();
// //   }, []);

// //   // View single product by ID
// //   const handleView = async (productId: number) => {
// //     try {
// //       const res = await axios.get(
// //         `${API_BASE_URL}/api/product/getproductbyid/${productId}`
// //       );
// //       setViewProduct(res.data);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   // Delete product
// //   const handleDelete = async (productId: number) => {
// //     if (window.confirm("Are you sure you want to delete this product?")) {
// //       try {
// //         await axios.delete(
// //           `${API_BASE_URL}/api/product/deleteproduct/${productId}`
// //         );
// //         fetchAllProducts(); // Refresh the list
// //       } catch (err) {
// //         console.error("Error deleting product:", err);
// //       }
// //     }
// //   };

// //   // Get status based on quantity
// //   const getStatus = (quantity: string | number | null): string => {
// //     const qty = parseInt(quantity as string) || 0;
// //     if (qty === 0) return "out-of-stock";
// //     if (qty < 10) return "low-stock";
// //     return "in-stock";
// //   };

// //   // Flatten products and variants for DataTable
// //   const getTableData = (): TableRow[] => {
// //     const rows: TableRow[] = [];
// //     products.forEach((p) => {
// //       const fallbackVariant = p.variants?.[0];

// //       rows.push({
// //         id: `p-${p.product_id}`,
// //         name: p.productName,
// //         regularPrice: p.regularPrice ?? fallbackVariant?.regularPrice ?? "-",
// //         salePrice: p.salePrice ?? fallbackVariant?.salePrice ?? "-",
// //         quantity: p.quantity ?? fallbackVariant?.quantity ?? 0,
// //         categoryId: p.category_id,
// //         isVariant: false,
// //         status: getStatus(p.quantity ?? fallbackVariant?.quantity ?? 0),
// //       });

// //       if (p.has_variants && p.variants && p.variants.length > 0) {
// //         p.variants.forEach((v) => {
// //           rows.push({
// //             id: `v-${v.product_category_id}`,
// //             name: v.productCategoryName,
// //             regularPrice: v.regularPrice,
// //             salePrice: v.salePrice,
// //             quantity: v.quantity,
// //             categoryId: p.category_id,
// //             isVariant: true,
// //             status: getStatus(v.quantity),
// //           });
// //         });
// //       }
// //     });

// //     return rows;
// //   };

// //   const tableData = getTableData();

// //   const columns: TableColumn<TableRow>[] = [
// //     {
// //       name: "IMAGE",
// //       selector: (row) => row.id,
// //       cell: (row) => {
// //         const product =
// //           products.find((p) => `p-${p.product_id}` === row.id) ||
// //           products.find((p) =>
// //             p.variants?.some((v) => `v-${v.product_category_id}` === row.id)
// //           );

// //         let imageUrl: string | undefined;

// //         if (product) {
// //           if (row.isVariant) {
// //             const variant = product.variants?.find(
// //               (v) => `v-${v.product_category_id}` === row.id
// //             );
// //             imageUrl = variant?.variantImages?.[0]?.image_url;
// //           } else {
// //             imageUrl = product.productImages?.[0]?.image_url;
// //           }
// //         }

// //         return (
// //           <div className="w-12 h-12 flex items-center justify-center">
// //             {imageUrl ? (
// //               <img
// //                 src={imageUrl}
// //                 alt={row.name}
// //                 className="w-12 h-12 object-cover rounded-lg border"
// //               />
// //             ) : (
// //               <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 text-xs" />
// //             )}
// //           </div>
// //         );
// //       },
// //       minWidth: "80px",
// //     },
// //     {
// //       name: "PRODUCT NAME",
// //       selector: (row) => row.name,
// //       sortable: true,
// //       cell: (row) => (
// //         <div className="flex items-center space-x-3">
// //           <div
// //             className={`w-3 h-3 rounded-full ${
// //               row.status === "in-stock"
// //                 ? "bg-green-500"
// //                 : row.status === "low-stock"
// //                 ? "bg-yellow-500"
// //                 : "bg-red-500"
// //             }`}
// //           ></div>
// //           <span
// //             className={`font-medium ${
// //               row.isVariant ? "text-gray-600 ml-2 text-md" : "text-gray-900"
// //             }`}
// //           >
// //             {row.name}
// //           </span>
// //           {row.isVariant && (
// //             <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
// //               Variant
// //             </span>
// //           )}
// //         </div>
// //       ),
// //       minWidth: "250px",
// //     },
// //     {
// //       name: "REGULAR PRICE",
// //       selector: (row) => row.regularPrice ?? "-",
// //       sortable: true,
// //       cell: (row) => (
// //         <span className="text-gray-600 font-medium">
// //           {row.regularPrice
// //             ? `₹${parseFloat(row.regularPrice as string).toLocaleString(
// //                 "en-IN"
// //               )}`
// //             : "-"}
// //         </span>
// //       ),
// //     },
// //     {
// //       name: "SALE PRICE",
// //       selector: (row) => row.salePrice ?? "-",
// //       sortable: true,
// //       cell: (row) => (
// //         <span className="text-green-600 font-bold">
// //           {row.salePrice
// //             ? `₹${parseFloat(row.salePrice as string).toLocaleString("en-IN")}`
// //             : "-"}
// //         </span>
// //       ),
// //     },
// //     {
// //       name: "QUANTITY",
// //       selector: (row) => row.quantity ?? "-",
// //       sortable: true,
// //       cell: (row) => {
// //         const qty = parseInt(row.quantity as string) || 0;
// //         let statusClass = "";
// //         if (qty === 0) statusClass = "text-red-600 bg-red-50";
// //         else if (qty < 10) statusClass = "text-yellow-600 bg-yellow-50";
// //         else statusClass = "text-green-600 bg-green-50";

// //         return (
// //           <span
// //             className={`px-2 py-1 rounded-full text-md font-medium ${statusClass}`}
// //           >
// //             {qty}
// //           </span>
// //         );
// //       },
// //     },
// //     {
// //       name: "CATEGORY",
// //       selector: (row) => row.categoryId,
// //       sortable: true,
// //       cell: (row) => (
// //         <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-md font-medium">
// //           #{row.categoryId}
// //         </span>
// //       ),
// //     },
// //     {
// //       name: "STATUS",
// //       selector: (row) => row.status,
// //       sortable: true,
// //       cell: (row) => {
// //         const statusConfig = {
// //           "in-stock": {
// //             label: "In Stock",
// //             class: "bg-green-100 text-green-800",
// //           },
// //           "low-stock": {
// //             label: "Low Stock",
// //             class: "bg-yellow-100 text-yellow-800",
// //           },
// //           "out-of-stock": {
// //             label: "Out of Stock",
// //             class: "bg-red-100 text-red-800",
// //           },
// //         };

// //         const config = statusConfig[row.status as keyof typeof statusConfig];
// //         return (
// //           <span
// //             className={`px-3 py-1 rounded-full text-xs font-medium ${config.class}`}
// //           >
// //             {config.label}
// //           </span>
// //         );
// //       },
// //     },
// //     {
// //       name: "ACTIONS",
// //       cell: (row) => {
// //         const productId = parseInt(row.id.replace("p-", "").replace("v-", ""));
// //         const isVariant = row.id.startsWith("v-");

// //         return (
// //           <div className="flex space-x-2">
// //             <button
// //               onClick={() => handleView(productId)}
// //               className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
// //               title="View Details"
// //             >
// //               <Eye size={18} />
// //             </button>
// //             <button
// //               onClick={() =>
// //                 router.push(
// //                   `/dashboard/edit-product/${productId}${
// //                     isVariant ? "?variant=true" : ""
// //                   }`
// //                 )
// //               }
// //               className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
// //               title="Edit Product"
// //             >
// //               <SquarePen size={18} />
// //             </button>
// //             <button
// //               onClick={() => handleDelete(productId)}
// //               className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
// //               title="Delete Product"
// //             >
// //               <Trash2 size={18} />
// //             </button>
// //           </div>
// //         );
// //       },
// //       minWidth: "150px",
// //     },
// //   ];

// //   const filteredItems = tableData.filter(
// //     (item) =>
// //       // item.name.toLowerCase().includes(filterText.toLowerCase()) ||
// //       (item.regularPrice ?? "")
// //         .toString()
// //         .toLowerCase()
// //         .includes(filterText.toLowerCase()) ||
// //       (item.salePrice ?? "")
// //         .toString()
// //         .toLowerCase()
// //         .includes(filterText.toLowerCase()) ||
// //       (item.quantity ?? "")
// //         .toString()
// //         .toLowerCase()
// //         .includes(filterText.toLowerCase())
// //   );

// //   const statusFilteredItems =
// //     selectedStatus === "all"
// //       ? filteredItems
// //       : filteredItems.filter((item) => item.status === selectedStatus);

// //   const customStyles = {
// //     headRow: {
// //       style: {
// //         backgroundColor: "#f8fafc",
// //         borderBottomWidth: "1px",
// //         borderBottomColor: "#e2e8f0",
// //         fontWeight: "600",
// //       },
// //     },
// //     headCells: {
// //       style: {
// //         fontSize: "14px",
// //         fontWeight: "600",
// //         color: "#374151",
// //         textTransform: "uppercase" as const,
// //         letterSpacing: "0.05em",
// //       },
// //     },
// //     rows: {
// //       style: {
// //         fontSize: "14px",
// //         "&:not(:last-of-type)": {
// //           borderBottomWidth: "1px",
// //           borderBottomColor: "#f1f5f9",
// //         },
// //       },
// //       highlightOnHoverStyle: {
// //         backgroundColor: "#f8fafc",
// //         borderBottomColor: "#e2e8f0",
// //       },
// //     },
// //   };

  

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       {/* Header Section */}
// //       <div className="mb-8">
// //         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
// //           <div>
// //             <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
// //             <p className="text-gray-600">Manage your product inventory and variants</p>
// //           </div>
// //           <div>
// //             <button
// //               onClick={() => router.push("/dashboard/add-product")}
// //               className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mt-4 lg:mt-0"
// //             >
// //               <Plus size={20} />
// //               <span>Add New Product</span>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
// //           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-2xl font-bold text-gray-600">Total Products</p>
// //                 <p className="text-2xl font-bold text-gray-900">
// //                   {products.reduce(
// //                     (total, product) =>
// //                       total + 1 + (product.has_variants && product.variants ? product.variants.length : 0),
// //                     0
// //                   )}
// //                 </p>
// //               </div>
// //               <div className="bg-blue-100 p-3 rounded-lg">
// //                 <Filter className="text-blue-600" size={20} />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-md font-medium text-gray-600">In Stock</p>
// //                 <p className="text-2xl font-bold text-green-600">{tableData.filter(item => item.status === "in-stock").length}</p>
// //               </div>
// //               <div className="bg-green-100 p-3 rounded-lg">
// //                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-md font-medium text-gray-600">Low Stock</p>
// //                 <p className="text-2xl font-bold text-yellow-600">{tableData.filter(item => item.status === "low-stock").length}</p>
// //               </div>
// //               <div className="bg-yellow-100 p-3 rounded-lg">
// //                 <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="text-md font-medium text-gray-600">Out of Stock</p>
// //                 <p className="text-2xl font-bold text-red-600">{tableData.filter(item => item.status === "out-of-stock").length}</p>
// //               </div>
// //               <div className="bg-red-100 p-3 rounded-lg">
// //                 <div className="w-2 h-2 bg-red-500 rounded-full"></div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Filters and Search Section */}
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //           {/* Status Filter */}
// //           <div>
// //             <label className="block text-md font-medium text-gray-700 mb-2">Product Status</label>
// //             <div className="relative">
// //               <select
// //                 value={selectedStatus}
// //                 onChange={(e) => setSelectedStatus(e.target.value)}
// //                 className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 cursor-pointer"
// //               >
// //                 <option value="all">All Products</option>
// //                 <option value="in-stock">In Stock</option>
// //                 <option value="low-stock">Low Stock</option>
// //                 <option value="out-of-stock">Out of Stock</option>
// //               </select>
// //               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
// //                 <svg className="h-10 w-10 mr-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                 </svg>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Search Input */}
// //           <div>
// //             <label className="block text-md font-medium text-gray-700 mb-2">Search Products</label>
// //             <div className="border h-[50px] pl-5 flex items-center border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
// //               <Search className="text-gray-400 mr-2" size={20} />
// //               <input
// //                 type="text"
// //                 placeholder="Search by name, price, or quantity..."
// //                 value={filterText}
// //                 onChange={(e) => setFilterText(e.target.value)}
// //                 className="w-full border-none focus:ring-0 text-md bg-transparent"
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Products Table */}
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// //         <DataTable
// //           columns={columns}
// //           data={statusFilteredItems}
// //           pagination
// //           paginationPerPage={10}
// //           paginationRowsPerPageOptions={[10, 25, 50, 100]}
// //           highlightOnHover
// //           pointerOnHover
// //           progressPending={isLoading}
// //           customStyles={customStyles}
// //           noDataComponent={
// //             <div className="text-center py-12">
// //               <div className="text-gray-400 mb-4">
// //                 <Search size={48} className="mx-auto" />
// //               </div>
// //               <h3 className="text-lg font-semibold text-gray-900 mb-2">
// //                 No products found
// //               </h3>
// //               <p className="text-gray-600 mb-4">
// //                 Try adjusting your search or filter criteria
// //               </p>
// //               <button
// //                 onClick={() => router.push("/dashboard/product-add")}
// //                 className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-2 rounded-lg font-medium transition-colors duration-200"
// //               >
// //                 Add Your First Product
// //               </button>
// //             </div>
// //           }
// //         />
// //       </div>

// //       {/* {viewProduct && (
// //         <ProductViewModal
// //           product={viewProduct}
// //           onClose={() => setViewProduct(null)}
// //         />
// //       )} */}
// //     </div>
// //   );
// // };

// // export default ProductTable;



// "use client";

// import { API_BASE_URL } from "@/lib/api";
// import axios from "axios";
// import {
//   Eye,
//   SquarePen,
//   Trash2,
//   Search,
//   Plus,
//   Filter,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import React, { useState, useEffect } from "react";
// import DataTable, { TableColumn } from "react-data-table-component";
// import ProductViewModal from "./ProductViewModal";

// interface Variant {
//   product_variant_id: number;
//   productVariantName: string;
//   regularPrice: string;
//   salePrice: string;
//   weights: string;
//   quantity: number;
//   is_default: number;
// }

// interface Product {
//   product_id: number;
//   category_id: number;
//   productName: string;
//   regularPrice: string | null;
//   salePrice: string | null;
//   weights: string | null;
//   quantity: string | number | null;
//   description: string;
//   has_variants: number;
//   variants?: Variant[];
// }

// interface TableRow {
//   id: string;
//   name: string;
//   regularPrice: string | number | null;
//   salePrice: string | number | null;
//   quantity: string | number | null;
//   categoryId: number;
//   isVariant: boolean;
//   status: string;
// }

// const ProductTable = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filterText, setFilterText] = useState("");
//   const [viewProduct, setViewProduct] = useState<Product | Variant | null>(null);
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   // Fetch all products
//   const fetchAllProducts = async () => {
//     try {
//       setIsLoading(true);
//       const res = await axios.get(`${API_BASE_URL}/api/product/getallproducts`);
//       setProducts(res.data || []);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       setProducts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllProducts();
//   }, []);

//   // View single product or variant
//   const handleView = async (id: number, isVariant: boolean) => {
//     try {
//       if (isVariant) {
//         // ✅ Try fetching variant data
//         const res = await axios.get(
//           `${API_BASE_URL}/api/product/getvariantbyid/${id}`
//         );
//         setViewProduct(res.data);
//       } else {
//         // ✅ Normal product fetch
//         const res = await axios.get(
//           `${API_BASE_URL}/api/product/getproductbyid/${id}`
//         );
//         setViewProduct(res.data);
//       }
//     } catch (err) {
//       console.error("Error fetching product/variant:", err);
//     }
//   };

//   // Delete product
//   const handleDelete = async (productId: number) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await axios.delete(
//           `${API_BASE_URL}/api/product/deleteproduct/${productId}`
//         );
//         fetchAllProducts(); // Refresh the list
//       } catch (err) {
//         console.error("Error deleting product:", err);
//       }
//     }
//   };

//   // Get stock status
//   const getStatus = (quantity: string | number | null): string => {
//     const qty = parseInt(quantity as string) || 0;
//     if (qty === 0) return "out-of-stock";
//     if (qty < 10) return "low-stock";
//     return "in-stock";
//   };

//   // Flatten products and variants for table
//   const getTableData = (): TableRow[] => {
//     const rows: TableRow[] = [];

//     products.forEach((p) => {
//       rows.push({
//         id: `p-${p.product_id}`,
//         name: p.productName,
//         regularPrice: p.regularPrice,
//         salePrice: p.salePrice,
//         quantity: p.quantity,
//         categoryId: p.category_id,
//         isVariant: false,
//         status: getStatus(p.quantity),
//       });

//       if (p.has_variants && p.variants?.length) {
//         p.variants.forEach((v) => {
//           rows.push({
//             id: `v-${v.product_variant_id}`,
//             name: v.productVariantName,
//             regularPrice: v.regularPrice,
//             salePrice: v.salePrice,
//             quantity: v.quantity,
//             categoryId: p.category_id,
//             isVariant: true,
//             status: getStatus(v.quantity),
//           });
//         });
//       }
//     });

//     return rows;
//   };

//   const tableData = getTableData();

//   const columns: TableColumn<TableRow>[] = [
//     {
//       name: "PRODUCT NAME",
//       selector: (row) => row.name,
//       sortable: true,
//       cell: (row) => (
//         <div className="flex text-2xl items-center space-x-3">
//           <div
//             className={`w-3 h-3 rounded-full ${
//               row.status === "in-stock"
//                 ? "bg-green-500"
//                 : row.status === "low-stock"
//                 ? "bg-yellow-500"
//                 : "bg-red-500"
//             }`}
//           ></div>
//           <span
//             className={`font-bold ${
//               row.isVariant ? "text-gray-600 ml-2 text-md" : "text-gray-900"
//             }`}
//           >
//             {row.name}
//           </span>
//           {row.isVariant && (
//             <span className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full">
//               Variant
//             </span>
//           )}
//         </div>
//       ),
//       minWidth: "250px",
//     },
//     {
//       name: "REGULAR PRICE",
//       selector: (row) => row.regularPrice ?? "-",
//       sortable: true,
//       cell: (row) => (
//         <span className="text-gray-600 text-md font-medium">
//           {row.regularPrice
//             ? `₹${parseFloat(row.regularPrice as string).toLocaleString("en-IN")}`
//             : "-"}
//         </span>
//       ),
//     },
//     {
//       name: "SALE PRICE",
//       selector: (row) => row.salePrice ?? "-",
//       sortable: true,
//       cell: (row) => (
//         <span className="text-green-600 font-bold">
//           {row.salePrice
//             ? `₹${parseFloat(row.salePrice as string).toLocaleString("en-IN")}`
//             : "-"}
//         </span>
//       ),
//     },
//     {
//       name: "QUANTITY",
//       selector: (row) => row.quantity ?? "-",
//       sortable: true,
//       cell: (row) => {
//         const qty = parseInt(row.quantity as string) || 0;
//         let statusClass = "";
//         if (qty === 0) statusClass = "text-red-600 bg-red-50";
//         else if (qty < 10) statusClass = "text-yellow-600 bg-yellow-50";
//         else statusClass = "text-green-600 bg-green-50";

//         return (
//           <span
//             className={`px-2 py-1 rounded-full text-md font-medium ${statusClass}`}
//           >
//             {qty}
//           </span>
//         );
//       },
//     },
//     {
//       name: "CATEGORY",
//       selector: (row) => row.categoryId,
//       sortable: true,
//       cell: (row) => (
//         <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-md font-medium">
//           #{row.categoryId}
//         </span>
//       ),
//     },
//     {
//       name: "STATUS",
//       selector: (row) => row.status,
//       sortable: true,
//       cell: (row) => {
//         const statusConfig = {
//           "in-stock": { label: "In Stock", class: "bg-green-100 text-green-800" },
//           "low-stock": { label: "Low Stock", class: "bg-yellow-100 text-yellow-800" },
//           "out-of-stock": { label: "Out of Stock", class: "bg-red-100 text-red-800" },
//         };
//         const config = statusConfig[row.status as keyof typeof statusConfig];
//         return (
//           <span
//             className={`px-3 py-1 rounded-full text-md font-medium ${config.class}`}
//           >
//             {config.label}
//           </span>
//         );
//       },
//     },
//     {
//       name: "ACTIONS",
//       cell: (row) => {
//         const id = parseInt(row.id.replace("p-", "").replace("v-", ""));
//         const isVariant = row.id.startsWith("v-");
//         return (
//           <div className="flex space-x-2">
//             <button
//               onClick={() => handleView(id, isVariant)}
//               className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
//               title="View Details"
//             >
//               <Eye className="text-blue-600" size={24} />
//             </button>
//             <button
//               className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
//               title="Edit Product"
//             >
//               <SquarePen className="text-green-600" size={24} />
//             </button>
//             <button
//               onClick={() => handleDelete(id)}
//               className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
//               title="Delete Product"
//             >
//               <Trash2 className="text-red-600" size={24} />
//             </button>
//           </div>
//         );
//       },
//       minWidth: "150px",
//     },
//   ];

//   const filteredItems = tableData.filter(
//     (item) =>
//       item.name.toLowerCase().includes(filterText.toLowerCase()) ||
//       (item.regularPrice ?? "")
//         .toString()
//         .toLowerCase()
//         .includes(filterText.toLowerCase()) ||
//       (item.salePrice ?? "")
//         .toString()
//         .toLowerCase()
//         .includes(filterText.toLowerCase()) ||
//       (item.quantity ?? "")
//         .toString()
//         .toLowerCase()
//         .includes(filterText.toLowerCase())
//   );

//   const statusFilteredItems =
//     selectedStatus === "all"
//       ? filteredItems
//       : filteredItems.filter((item) => item.status === selectedStatus);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
//           <p className="text-gray-600">
//             Manage your product inventory and variants
//           </p>
//         </div>
//         <button
//           onClick={() => router.push("/dashboard/add-product")}
//           className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 mt-4 lg:mt-0"
//         >
//           <Plus size={20} />
//           <span>Add New Product</span>
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <DataTable
//           columns={columns}
//           data={statusFilteredItems}
//           pagination
//           paginationPerPage={10}
//           highlightOnHover
//           progressPending={isLoading}
//           noDataComponent={<div className="p-10 text-gray-600">No products found</div>}
//         />
//       </div>

//       {viewProduct && (
//         <ProductViewModal
//           product={viewProduct}
//           onClose={() => setViewProduct(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default ProductTable;
