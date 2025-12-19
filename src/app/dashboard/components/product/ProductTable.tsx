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

// // ⭐ Toastify
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

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
//   const [viewProduct, setViewProduct] = useState<Product | null>(null);
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

//   // View Product or Variant
//   const handleView = (row: TableRow) => {
//     if (row.isVariant) {
//       const parentProduct = products.find(
//         (p) => p.product_id === row.categoryId
//       );
//       if (parentProduct && parentProduct.variants) {
//         const variant = parentProduct.variants.find(
//           (v) => v.product_variant_id === parseInt(row.id.replace("v-", ""))
//         );
//         if (variant) {
//           setViewProduct({ ...parentProduct, variants: [variant] });
//         }
//       }
//     } else {
//       const product = products.find(
//         (p) => p.product_id === parseInt(row.id.replace("p-", ""))
//       );
//       if (product) setViewProduct(product);
//     }
//   };

//   // Delete product
//   const handleDelete = async (row: TableRow) => {
//     const id = parseInt(row.id.replace("p-", "").replace("v-", ""));

//     if (!window.confirm("Are you sure you want to delete this product?")) {
//       return;
//     }

//     try {
//       await axios.delete(`${API_BASE_URL}/api/product/deleteProduct/${id}`);
//       fetchAllProducts();

//       // ⭐ Toastify Notification
//      toast.success("Product deleted successfully!");
//     } catch (err) {
//       console.error("Delete error:", err);

//       toast.error("Failed to delete product!");
//     }
//   };

//   // Stock status
//   const getStatus = (quantity: string | number | null): string => {
//     const qty = parseInt(quantity as string) || 0;
//     if (qty === 0) return "out-of-stock";
//     if (qty < 10) return "low-stock";
//     return "in-stock";
//   };

//   // Table rows
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
//             categoryId: p.product_id,
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
//     },
//     {
//       name: "REGULAR PRICE",
//       selector: (row) => row.regularPrice ?? "-",
//       sortable: true,
//       cell: (row) => (
//         <span className="text-gray-600 text-md font-medium">
//           {row.regularPrice
//             ? `₹${parseFloat(row.regularPrice as string).toLocaleString(
//                 "en-IN"
//               )}`
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
//           "in-stock": {
//             label: "In Stock",
//             class: "bg-green-100 text-green-800",
//           },
//           "low-stock": {
//             label: "Low Stock",
//             class: "bg-yellow-100 text-yellow-800",
//           },
//           "out-of-stock": {
//             label: "Out of Stock",
//             class: "bg-red-100 text-red-800",
//           },
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
//         const productId = row.isVariant
//           ? row.categoryId
//           : parseInt(row.id.replace("p-", ""));

//         return (
//           <div className="flex space-x-2">
//             <button
//               onClick={() => handleView(row)}
//               className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
//               title="View Details"
//             >
//               <Eye className="text-blue-600" size={24} />
//             </button>
//             <button
//               className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
//               title="Edit Product"
//               onClick={() =>
//                 router.push(`/dashboard/edit-product/${productId}`)
//               }
//             >
//               <SquarePen className="text-green-600" size={24} />
//             </button>
//             <button
//               onClick={() => handleDelete(row)}
//               className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
//               title="Delete Product"
//             >
//               <Trash2 className="text-red-600" size={24} />
//             </button>
//           </div>
//         );
//       },
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
//     <div className="p-6 min-h-screen">

//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
//           <div>
//             <p className="text-[40px] font-bold text-gray-900 mb-2">Products</p>
//             <p className="text-gray-600">
//               Manage your product inventory and variants
//             </p>
//           </div>
//           <div className="w-[200px] h-[50px] bg-[#629d23] text-white flex items-center rounded-lg">
//             <button
//               onClick={() => router.push("/dashboard/add-product")}
//               className="px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mt-4 lg:mt-0"
//             >
//               <Plus size={20} />
//               <span>Add New Product</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-2xl font-bold text-gray-600">
//                   Total Products
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {products.length +
//                     products.reduce(
//                       (acc, p) => acc + (p.variants?.length || 0),
//                       0
//                     )}
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <Filter className="text-blue-600" size={20} />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//             <p className="text-md font-medium text-gray-600">In Stock</p>
//             <p className="text-2xl font-bold text-green-600">
//               {tableData.filter((i) => i.status === "in-stock").length}
//             </p>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//             <p className="text-md font-medium text-gray-600">Low Stock</p>
//             <p className="text-2xl font-bold text-yellow-600">
//               {tableData.filter((i) => i.status === "low-stock").length}
//             </p>
//           </div>

//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
//             <p className="text-md font-medium text-gray-600">Out of Stock</p>
//             <p className="text-2xl font-bold text-red-600">
//               {tableData.filter((i) => i.status === "out-of-stock").length}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* Status Filter */}
//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-2">
//               Product Status
//             </label>
//             <div className="relative border flex items-center h-[50px] border-gray-300 rounded-lg cursor-pointer">
//               <div className="w-full bg-white px-4 py-2.5 pr-10 duration-200">
//                 <select
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   className="appearance-none cursor-pointer"
//                 >
//                   <option value="all">All Products</option>
//                   <option value="in-stock">In Stock</option>
//                   <option value="low-stock">Low Stock</option>
//                   <option value="out-of-stock">Out of Stock</option>
//                 </select>
//               </div>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
//                 <svg
//                   className="h-10 w-10 mr-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Search Input */}
//           <div>
//             <label className="block text-md font-medium text-gray-700 mb-2">
//               Search Products
//             </label>
//             <div className="border h-[50px] pl-5 flex items-center border-gray-300 rounded-lg">
//               <Search className="text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search by name, price..."
//                 value={filterText}
//                 onChange={(e) => setFilterText(e.target.value)}
//                 className="w-full pl-3 pr-4 py-2.5"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Active Filter Tag */}
//         {selectedStatus !== "all" && (
//           <div className="flex items-center gap-2 mt-4">
//             <span className="text-md text-gray-600">Active filter:</span>
//             <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-md font-medium flex items-center gap-2">
//               {selectedStatus === "in-stock" && "In Stock"}
//               {selectedStatus === "low-stock" && "Low Stock"}
//               {selectedStatus === "out-of-stock" && "Out of Stock"}

//               <button
//                 onClick={() => setSelectedStatus("all")}
//                 className="hover:text-blue-600"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Data Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <DataTable
//           columns={columns}
//           data={statusFilteredItems}
//           pagination
//           paginationPerPage={10}
//           highlightOnHover
//           progressPending={isLoading}
//           noDataComponent={
//             <div className="p-10 text-gray-600">No products found</div>
//           }
//         />
//       </div>

//       {viewProduct && (
//         <ProductViewModal
//           product={viewProduct}
//           onClose={() => setViewProduct(null)}
//         />
//       )}

//       {/* ⭐ Toast Container */}
//       <ToastContainer position="top-right" autoClose={2000} theme="colored" />
//     </div>
//   );
// };

// export default ProductTable;

"use client";

import { API_BASE_URL } from "@/lib/api";
import axios from "axios";
import { Eye, SquarePen, Trash2, Search, Plus, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import ProductViewModal from "./ProductViewModal";

// Toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------------- TYPES ---------------- */

interface Variant {
  product_variant_id: number;
  productVariantName: string;
  regularPrice: string;
  salePrice: string;
  weights: string;
  quantity: number;
  is_default: number;
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
  variants?: Variant[];
}

interface TableRow {
  product_id: number;
  name: string;
  regularPrice: string | number | null;
  salePrice: string | number | null;
  quantity: string | number | null;
  categoryId: number;
  status: string;
  hasVariants: boolean;
}

/* ---------------- COMPONENT ---------------- */

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterText, setFilterText] = useState("");
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /* ---------------- FETCH ---------------- */

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/product/getallproducts`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  /* ---------------- HELPERS ---------------- */

  // Stock status
  const getStatus = (quantity: string | number | null): string => {
    const qty = parseInt(quantity as string) || 0;
    if (qty === 0) return "out-of-stock";
    if (qty < 10) return "low-stock";
    return "in-stock";
  };

  /* ---------------- TABLE DATA (ONLY PRODUCTS) ---------------- */

  const tableData: TableRow[] = products.map((p) => ({
    product_id: p.product_id,
    name: p.productName,
    regularPrice: p.regularPrice,
    salePrice: p.salePrice,
    quantity: p.quantity,
    categoryId: p.category_id,
    status: getStatus(p.quantity),
    hasVariants: !!p.has_variants,
  }));

  /* ---------------- COLUMNS ---------------- */

  const columns: TableColumn<TableRow>[] = [
    {
      name: "PRODUCT NAME",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              row.status === "in-stock"
                ? "bg-green-500"
                : row.status === "low-stock"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          />
          <span className="font-bold text-gray-900">{row.name}</span>
          {row.hasVariants && (
            <span className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full">
              Variants
            </span>
          )}
        </div>
      ),
    },
    {
      name: "REGULAR PRICE",
      selector: (row) => row.regularPrice ?? "-",
      sortable: true,
      cell: (row) => (
        <span className="text-gray-600 font-medium">
          {row.regularPrice
            ? `₹${parseFloat(row.regularPrice as string).toLocaleString(
                "en-IN"
              )}`
            : "-"}
        </span>
      ),
    },
    {
      name: "SALE PRICE",
      selector: (row) => row.salePrice ?? "-",
      sortable: true,
      cell: (row) => (
        <span className="text-green-600 font-bold">
          {row.salePrice
            ? `₹${parseFloat(row.salePrice as string).toLocaleString("en-IN")}`
            : "-"}
        </span>
      ),
    },
    {
      name: "QUANTITY",
      selector: (row) => row.quantity ?? "-",
      sortable: true,
      cell: (row) => {
        const qty = parseInt(row.quantity as string) || 0;
        const cls =
          qty === 0
            ? "text-red-600 bg-red-50"
            : qty < 10
            ? "text-yellow-600 bg-yellow-50"
            : "text-green-600 bg-green-50";
        return (
          <span className={`px-2 py-1 rounded-full font-medium ${cls}`}>
            {qty}
          </span>
        );
      },
    },
    {
      name: "CATEGORY",
      selector: (row) => row.categoryId,
      sortable: true,
      cell: (row) => (
        <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
          #{row.categoryId}
        </span>
      ),
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        const statusConfig = {
          "in-stock": {
            label: "In Stock",
            class: "bg-green-100 text-green-800",
          },
          "low-stock": {
            label: "Low Stock",
            class: "bg-yellow-100 text-yellow-800",
          },
          "out-of-stock": {
            label: "Out of Stock",
            class: "bg-red-100 text-red-800",
          },
        };
        const config = statusConfig[row.status as keyof typeof statusConfig];
        return (
          <span
            className={`px-3 py-1 rounded-full text-md font-medium ${config.class}`}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      name: "ACTIONS",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() =>
              setViewProduct(
                products.find((p) => p.product_id === row.product_id) || null
              )
            }
            className="p-2 hover:bg-blue-50 rounded"
          >
            <Eye className="text-blue-600" />
          </button>

          <button
            onClick={() =>
              router.push(`/dashboard/edit-product/${row.product_id}`)
            }
            className="p-2 hover:bg-green-50 rounded"
          >
            <SquarePen className="text-green-600" />
          </button>

          <button
            onClick={async () => {
              if (!confirm("Delete this product?")) return;
              try {
                await axios.delete(
                  `${API_BASE_URL}/api/product/deleteProduct/${row.product_id}`
                );
                toast.success("Product deleted");
                fetchAllProducts();
              } catch {
                toast.error("Delete failed");
              }
            }}
            className="p-2 hover:bg-red-50 rounded"
          >
            <Trash2 className="text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  /* ---------------- FILTERS ---------------- */

  const filteredItems = tableData.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      (item.regularPrice ?? "")
        .toString()
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      (item.salePrice ?? "")
        .toString()
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      (item.quantity ?? "")
        .toString()
        .toLowerCase()
        .includes(filterText.toLowerCase())
  );

  const statusFilteredItems =
    selectedStatus === "all"
      ? filteredItems
      : filteredItems.filter((item) => item.status === selectedStatus);
  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <p className="text-[40px] font-bold text-gray-900 mb-2">Products</p>
            <p className="text-gray-600">
              Manage your product inventory and variants
            </p>
          </div>
          <div className="w-[200px] h-[50px] bg-[#629d23] text-white flex items-center rounded-lg">
            <button
              onClick={() => router.push("/dashboard/add-product")}
              className="px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mt-4 lg:mt-0"
            >
              <Plus size={20} />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.length +
                    products.reduce(
                      (acc, p) => acc + (p.variants?.length || 0),
                      0
                    )}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Filter className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-md font-medium text-gray-600">In Stock</p>
            <p className="text-2xl font-bold text-green-600">
              {tableData.filter((i) => i.status === "in-stock").length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-md font-medium text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">
              {tableData.filter((i) => i.status === "low-stock").length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-md font-medium text-gray-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">
              {tableData.filter((i) => i.status === "out-of-stock").length}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      {/* <div className="bg-white p-4 rounded-xl mb-4 border">
        <input
          placeholder="Search product..."
          className="w-full border p-3 rounded"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div> */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Product Status
            </label>
            <div className="relative border flex items-center h-[50px] border-gray-300 rounded-lg cursor-pointer">
              <div className="w-full bg-white px-4 py-2.5 pr-10 duration-200">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none cursor-pointer"
                >
                  <option value="all">All Products</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="h-10 w-10 mr-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="border h-[50px] pl-5 flex items-center border-gray-300 rounded-lg">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, price..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-3 pr-4 py-2.5"
              />
            </div>
          </div>
        </div>

        {/* Active Filter Tag */}
        {selectedStatus !== "all" && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-md text-gray-600">Active filter:</span>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-md font-medium flex items-center gap-2">
              {selectedStatus === "in-stock" && "In Stock"}
              {selectedStatus === "low-stock" && "Low Stock"}
              {selectedStatus === "out-of-stock" && "Out of Stock"}

              <button
                onClick={() => setSelectedStatus("all")}
                className="hover:text-blue-600"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={statusFilteredItems}
        pagination
        progressPending={isLoading}
        noDataComponent="No products found"
      />

      {/* Modal */}
      {viewProduct && (
        <ProductViewModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}

      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </div>
  );
};

export default ProductTable;
