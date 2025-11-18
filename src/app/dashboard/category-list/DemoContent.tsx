"use client";

import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import axios from "axios";
import AddEditCategoryPage from "../category-add/DemoContext";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  X,
  SquarePen,
  Eye,
  Trash2,
  Package,
  Search,
  Filter,
  Plus,
  MoreVertical,
  TrendingUp,
  FolderOpen,
  Calendar,
  Edit3,
  Layers,
  BarChart3,
  Download,
  Upload,
} from "lucide-react";

interface Category {
  category_id: number;
  categoryName: string;
  created_at: string;
  updated_at: string;
}

interface CategoryDetail {
  category_id: number;
  categoryName: string;
  description?: string;
  image?: string;
  productCount?: number;
  subcategoryCount?: number;
}

interface Product {
  product_id: number;
  productName: string;
  regularPrice?: number | null;
  salePrice?: number | null;
  weights?: string | null;
  quantity?: number | null;
}

const CategoryDashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterText, setFilterText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Category[]>([]);
  const [viewCategory, setViewCategory] = useState<CategoryDetail | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/categories/getallcategory`
      );
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleView = async (id: number) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/categories/getcategorybyid/${id}`
      );
      const productsRes = await axios.get(
        `${API_BASE_URL}/api/product/getproductbycategory/${id}`
      );

      setViewCategory({
        category_id: res.data.category_id,
        categoryName: res.data.categoryName,
        description: res.data.description,
        image: res.data.image,
        productCount: productsRes.data.length || 0,
      });
    } catch (err) {
      console.error("Error fetching category details:", err);
    }
  };

  const handleShowProducts = async (categoryId: number) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/product/getproductbycategory/${categoryId}`
      );
      setCategoryProducts(res.data || []);
      setShowProductsModal(true);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/categories/deletecategory/${id}`);
      setCategories(categories.filter((c) => c.category_id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (id: number) => {
    setSelectedCategoryId(id);
    setShowForm(true);
  };

  // Custom styles for DataTable
  const customStyles = {
    head: {
      style: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#6b7280",
        backgroundColor: "#f9fafb",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        "&:not(:last-of-type)": {
          borderBottom: "1px solid #f3f4f6",
        },
        "&:hover": {
          backgroundColor: "#f8fafc",
        },
      },
    },
  };

  const columns: TableColumn<Category>[] = [
    {
      name: "ID",
      selector: (row) => row.category_id,
      sortable: true,
      width: "100px",
      cell: (row) => (
        <span className="font-mono text-green-600 font-semibold">
          #{row.category_id}
        </span>
      ),
    },
    {
      name: "CATEGORY NAME",
      selector: (row) => row.categoryName,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <FolderOpen size={18} className="text-green-600" />
          </div>
          <span className="font-semibold text-gray-800">
            {row.categoryName}
          </span>
        </div>
      ),
    },
    {
      name: "CREATED DATE",
      selector: (row) => row.created_at,
      cell: (row) => (
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar size={16} className="text-green-600" />
          <span>{new Date(row.created_at).toLocaleDateString()}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "LAST UPDATED",
      selector: (row) => row.updated_at,
      cell: (row) => (
        <div className="flex items-center space-x-2 text-gray-600">
          <Edit3 size={16}  className="text-green-600"/>
          <span>{new Date(row.updated_at).toLocaleDateString()}</span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "ACTIONS",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(row.category_id)}
            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 hover:scale-105"
            title="View Details"
          >
            <Eye size={23} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleEdit(row.category_id)}
            className="p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-all duration-200 hover:scale-105"
            title="Edit Category"
          >
            <SquarePen size={23} className="text-green-600" />
          </button>
          <button
            onClick={() => handleDelete(row.category_id)}
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 hover:scale-105"
            title="Delete Category"
          >
            <Trash2 size={23} className="text-red-500" />
          </button>
        </div>
      ),
      width: "200px",
    },
  ];

  const filteredItems = categories.filter((item) =>
    item.categoryName.toLowerCase().includes(filterText.toLowerCase())
  );

  // Stats calculation
  const totalCategories = categories.length;
  const newCategories = categories.filter((cat) => {
    const createdDate = new Date(cat.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  return (
    <div className="min-h-screen p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start lg:items-center mb-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Category Management
            </h3>
            <p className="text-gray-600">
              Manage your product categories and organization
            </p>
          </div>
          <div
            onClick={() => router.push("/dashboard/category-add")}
            className="flex rts-btn btn-primary transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-md text-white px-6 py-3 rounded-xl font-semibold"
          >
            
            <div className="">
              <span>Add New Category</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Categories
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalCategories}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Layers className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  New This Week
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {newCategories}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Active Products
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {categories.reduce(
                    (acc, cat) => acc + (cat as any).productCount || 0,
                    0
                  )}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <Package className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex w-full flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex w-[400px] flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full pl-4 flex items-center border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <div className="text-gray-500">
                  <Search className="text-gray-400" size={20} />
                </div>
                <div className="">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="pl-10 pr-4 py-3  transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {selectedRows.length > 0 && (
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium">
                  {selectedRows.length} selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="p-6">
          <DataTable
            columns={columns}
            data={filteredItems}
            selectableRows
            onSelectedRowsChange={({ selectedRows }) =>
              setSelectedRows(selectedRows)
            }
            pagination
            paginationPerPage={rowsPerPage}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            noDataComponent={
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No categories found
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by creating your first category
                </p>
                <button
                  onClick={() => router.push("/dashboard/category-add")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Category
                </button>
              </div>
            }
            progressPending={loading}
            progressComponent={
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            }
            highlightOnHover
            responsive
            customStyles={customStyles}
          />
        </div>
      </div>
      {/* Add/Edit Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <AddEditCategoryPage
            categoryId={selectedCategoryId?.toString() || undefined}
            onClose={() => setShowForm(false)}
            onSaved={() => {
              setShowForm(false);
              fetchCategories();
            }}
          />
        </div>
      )}

      {/* View Category Modal */}
      {viewCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto transform transition-all duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-600">
                Category Details
              </h3>
              <button
                onClick={() => setViewCategory(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {viewCategory.image && (
                <div className="flex justify-center">
                  <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden border-4 border-white shadow-lg"></div>
                </div>
              )}

              {/* Info Cards */}
              <div className="grid gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <span className="text-md font-semibold text-blue-700">
                    CATEGORY ID
                  </span>
                  <p className="text-2xl font-mono text-blue-900 bg-white/50 py-1 px-3 rounded-lg border border-blue-200">
                    {viewCategory.category_id}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <span className="text-md font-semibold text-gray-700">
                    DESCRIPTION
                  </span>
                  <p className="text-gray-700 leading-relaxed bg-white/50 py-2 px-3 rounded-lg border border-gray-200 min-h-[60px]">
                    {viewCategory.description || (
                      <span className="text-gray-400 italic">
                        No description provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div
                  className="text-center p-3 bg-green-50 rounded-lg border border-green-100 cursor-pointer hover:bg-green-100 transition"
                  onClick={() => handleShowProducts(viewCategory.category_id)}
                >
                  <div className="text-3xl font-bold text-green-700">
                    {viewCategory.productCount || 0}
                  </div>
                  <div className="text-md text-green-600 font-medium">
                    Products
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="text-3xl font-bold text-purple-700">
                    {viewCategory.subcategoryCount || 0}
                  </div>
                  <div className="text-md text-purple-600 font-medium">
                    Subcategories
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-4 justify-start space-x-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <div className="button-area-botton-wrapper-p-list">
                <button
                  onClick={() => setViewCategory(null)}
                  className="rts-btn btn-primary bg-transparent"
                >
                  Close
                </button>
              </div>
              <div className="button-area-botton-wrapper-p-list">
                <button
                  className="rts-btn btn-primary bg-transparent"
                  onClick={() => {
                    setViewCategory(null);
                    handleEdit(viewCategory.category_id);
                  }}
                >
                  Edit Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Modal */}
      {showProductsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div className="w-full">
                <div className="flex w-full h-[45px] justify-between">
                  <div className="">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {viewCategory?.categoryName}
                    </h3>
                  </div>
                  <div className="mt-[10px]">
                    <button
                      onClick={() => setShowProductsModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {categoryProducts.length} product
                  {categoryProducts.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Products List - Grid Layout */}
            <div className="p-6">
              {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-h-250 overflow-y-auto custom-scrollbar">
                  {categoryProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
                    >
                      {/* Product Header */}
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1 pr-2">
                          {product.productName}
                        </h4>
                        {product.salePrice && product.regularPrice && (
                          <div className="text-[10px] w-[70px] h-[25px] flex justify-center items-center font-bold bg-green-500 text-white px-2 py-1 rounded-full">
                            {Math.round(
                              (1 - product.salePrice / product.regularPrice) *
                                100
                            )}
                            % OFF
                          </div>
                        )}
                      </div>

                      <div className="">
                        {/* Product Image Placeholder */}
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl w-full h-52 mb-4 flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>

                      {/* Product Details - Minimal Design */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          {/* Weight */}
                          <div className="group cursor-pointer">
                            <div className="border-2 h-100 bg-emerald-50 border-green-200 rounded-lg p-4 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200">
                              <div className="text-center space-y-2">
                                <div className="text-[14px] font-semibold text-gray-500 uppercase tracking-wider">
                                  Weight
                                </div>
                                <div className="h-12 flex items-center justify-center">
                                  {product.weights &&
                                  product.weights.trim() !== "" ? (
                                    <span className="text-[16px] font-bold text-gray-900">
                                      {product.weights}
                                    </span>
                                  ) : (
                                    <span className="text-lg text-gray-400">
                                      -
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Stock */}
                          <div className="group cursor-pointer">
                            <div
                              className={`border-2 bg-emerald-50 h-100 rounded-lg p-4 transition-all duration-200 ${
                                product.quantity
                                  ? "border-green-200 hover:border-emerald-500 hover:bg-green-50"
                                  : product.quantity
                                  ? "border-amber-200 hover:border-amber-500 hover:bg-amber-50"
                                  : "border-red-200 hover:border-red-500 bg-red-50 hover:bg-red-50"
                              }`}
                            >
                              <div className="text-center space-y-2">
                                <div className="text-[14px] font-semibold text-gray-500 uppercase tracking-wider">
                                  Stock
                                </div>
                                <div className="h-12 flex items-center justify-center">
                                  <span
                                    className={`text-[16px] font-bold ${
                                      product.quantity
                                        ? "text-green-700"
                                        : product.quantity
                                        ? "text-amber-700"
                                        : " text-red-700"
                                    }`}
                                  >
                                    {product.quantity != null &&
                                    !isNaN(product.quantity)
                                      ? product.quantity
                                      : "-"}
                                  </span>
                                </div>
                                <div
                                  className={`text-[12px] w-full font-medium px-2 py-1 rounded-full ${
                                    product.quantity
                                      ? "bg-green-100 text-green-700"
                                      : product.quantity
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {product.quantity
                                    ? "Available"
                                    : product.quantity
                                    ? "Low Stock"
                                    : "Out of Stock"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="group cursor-pointer">
                            <div className="border-2 border-green-200 h-100 rounded-lg p-4 hover:border-emerald-500 hover:bg-emerald-50 bg-emerald-50 transition-all duration-200">
                              <div className="text-center space-y-2">
                                <div className="text-[14px] font-semibold text-gray-500 uppercase tracking-wider">
                                  Price
                                </div>
                                <div className="h-12 flex items-center justify-center">
                                  {product.salePrice ? (
                                    <div className="space-y-2 pt-5">
                                      <div className="text-[18px] font-bold text-emerald-700">
                                        ₹{product.salePrice}
                                      </div>
                                      {product.regularPrice && (
                                        <div className="text-[16px] text-gray-500 line-through">
                                          ₹{product.regularPrice}
                                        </div>
                                      )}
                                    </div>
                                  ) : product.regularPrice ? (
                                    <div className="text-xl font-bold text-gray-900">
                                      ₹{product.regularPrice}
                                    </div>
                                  ) : (
                                    <div className="text-lg text-green-500">
                                      Not set
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary Bar */}
                        <div className="bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-center justify-between text-[14px]">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    product.quantity
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                ></div>
                                <span className="font-medium text-gray-700">
                                  {product.quantity
                                    ? "Available for purchase"
                                    : "Out of stock"}
                                </span>
                              </div>
                            </div>
                            {product.weights &&
                              product.weights.trim() !== "" && (
                                <div className="text-gray-600">
                                  <span className="font-semibold">
                                    {product.weights}
                                  </span>{" "}
                                  per unit
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">
                    No Products Found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    There are no products in this category yet. Start by adding
                    your first product.
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                    Add First Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDashboard;
