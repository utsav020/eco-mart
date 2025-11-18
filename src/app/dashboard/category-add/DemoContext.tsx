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
  onClose: () => void; // callback to close modal/page
  onSaved?: () => void; // callback after saving/updating
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
      const data = response.data;
      setFormData({
        categoryName: data.categoryName || "",
        description: data.description || "",
      });
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.error || "Failed to fetch category data."
      );
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
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setSuccessMsg("Category updated successfully!");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/categories/addcategory`,
          formData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setSuccessMsg("Category added successfully!");
        setFormData({ categoryName: "", description: "" });
      }
      onSaved?.(); // refresh parent list
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Add-category Page
    <div className="body-root-inner">
      <div className="transection">
        <div className="vendor-list-main-wrapper product-wrapper add-product-page">
          <div className="card-body table-product-select">
            <div className="header-two show right-collups-add-product">
              <div className="right-collups-area-top">
                <h3 className="text-2xl font-bold mb-2">
                  {isEditMode ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="mb-4 text-gray-600">
                  {isEditMode
                    ? "Update category details below"
                    : "Fill in details to add a new category"}
                </p>
              </div>

              {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
              {successMsg && (
                <p className="text-green-600 mb-2">{successMsg}</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows={4}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-10">
                  <div className="button-area-botton-wrapper-p-list">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rts-btn btn-primary"
                    >
                      {loading
                        ? isEditMode
                          ? "Updating..."
                          : "Adding..."
                        : isEditMode
                        ? "Update"
                        : "Add Category"
                      }
                    </button>
                  </div>
                  <div className="button-area-botton-wrapper-p-list">
                    <button
                      type="button"
                      onClick={onClose} 
                      className="rts-btn btn-primary bg-transparent"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditCategoryPage;
