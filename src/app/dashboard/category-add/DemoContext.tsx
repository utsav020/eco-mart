"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

interface CategoryForm {
  categoryName: string;
  description: string;
}

interface Props {
  categoryId?: string;
  onClose: () => void;
  onSaved?: () => void;
}

const AddEditCategoryPage: React.FC<Props> = ({
  categoryId,
  onClose,
  onSaved,
}) => {
  const [formData, setFormData] = useState<CategoryForm>({
    categoryName: "",
    description: "",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (categoryId) {
      setIsEditMode(true);
      fetchCategory(categoryId);
    } else {
      setIsEditMode(false);
    }
  }, [categoryId]);

  const fetchCategory = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/categories/getcategorybyid/${id}`
      );

      const data = response.data.data || response.data;

      setFormData({
        categoryName: data.categoryName || "",
        description: data.description || "",
      });
    } catch (error: any) {
      setErrorMsg("Failed to fetch category data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isEditMode && categoryId) {
        await axios.put(
          `${API_BASE_URL}/api/categories/updatecategory/${categoryId}`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        setSuccessMsg("Category updated successfully!");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/categories/addcategory`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        setSuccessMsg("Category added successfully!");
        setFormData({ categoryName: "", description: "" });
      }

      onSaved?.();
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.error || "Something went wrong, try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-8 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Category" : "Add New Category"}
        </h3>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Update category details below"
            : "Fill in details to add a new category"}
        </p>
      </div>

      {/* Messages */}
      {errorMsg && (
        <p className="text-red-500 bg-red-50 border border-red-200 px-4 py-2 rounded-lg mb-4">
          {errorMsg}
        </p>
      )}
      {successMsg && (
        <p className="text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-lg mb-4">
          {successMsg}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category Name */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Category Name
          </label>
          <div className="w-full border border-gray-300 rounded-lg py-2 text-gray-900 outline-none">
            <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            className=""
            required
          />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Description
          </label>
          <div className="w-full border border-gray-300 rounded-lg py-3 text-gray-900 outline-none">
            <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className=""
            rows={4}
          />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          {/* Cancel */}
          <div className="border w-[150px] border-[#629d23] flex items-center text-gray-700 hover:bg-[#629d23] rounded-md hover:text-white font-bold text-[18px]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-300  transition font-semibold"
            >
              Cancel
            </button>
          </div>

          {/* Submit */}
          <div className="bg-[#629d23] font-bold text-[18px] text-white h-[50px] w-[180px] flex items-center rounded-md">
            <button
              type="submit"
              disabled={loading}
              className=" disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update Category"
                : "Add Category"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditCategoryPage;
