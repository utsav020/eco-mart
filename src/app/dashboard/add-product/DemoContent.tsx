"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

const AddProductPage = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { category_id: number; categoryName: string }[]
  >([]);

  const [formData, setFormData] = useState({
    category_id: "",
    productName: "",
    description: "",
    has_variants: false,
    regularPrice: "",
    salePrice: "",
    weights: "",
    quantity: "",
    variants: [
      {
        productCategoryName: "",
        regularPrice: "",
        salePrice: "",
        weights: "",
        quantity: "",
        is_default: true,
        image: null,
      },
    ],
  });

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/categories/getallcategory`
        );

        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data?.categories) {
          setCategories(response.data.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
        setErrorMsg("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  // ✅ Handle input
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, type, value, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle variant input
  const handleVariantChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const newVariants = [...formData.variants];
    (newVariants[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  // ✅ Add variant
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          productCategoryName: "",
          regularPrice: "",
          salePrice: "",
          weights: "",
          quantity: "",
          is_default: false,
          image: null,
        },
      ],
    }));
  };

  // ✅ Remove variant
  const removeVariant = (index: number) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      // Ensure numeric fields are converted
      const payload = {
        ...formData,
        category_id: Number(formData.category_id),
        regularPrice: Number(formData.regularPrice),
        salePrice: Number(formData.salePrice),
        quantity: Number(formData.quantity),
        variants: formData.has_variants
          ? formData.variants.map((v) => ({
              ...v,
              regularPrice: Number(v.regularPrice),
              salePrice: Number(v.salePrice),
              quantity: Number(v.quantity),
            }))
          : [],
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/product/addproduct`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Product submitted successfully:", response.data);
      alert("Product submitted successfully!");

      // Redirect after success
      router.push("/dashboard/product-list");
    } catch (error: any) {
      console.error("❌ Error submitting product:", error);
      setErrorMsg(
        error.response?.data?.error ||
          "Failed to submit product. Please try again."
      );
    }
  };

  return (
    <div className="body-root-inner">
      <div className="transection">
        <div className="vendor-list-main-wrapper product-wrapper add-product-page">
          <div className="card-body table-product-select">
            <div className="header-two show right-collups-add-product">
              <div className="flex justify-between">
                <div className="right-collups-area-top">
                  <h6 className="title" style={{ fontSize: "32px" }}>
                    Add New Product
                  </h6>
                  <p>Add information and add new product</p>
                  {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                </div>
                <div className="single-input">
                  {!formData.has_variants ? (
                    <button
                      type="button"
                      className="rts-btn btn-primary"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          has_variants: true,
                          variants: [
                            {
                              productCategoryName: "",
                              regularPrice: "",
                              salePrice: "",
                              weights: "",
                              quantity: "",
                              is_default: true,
                              image: null,
                            },
                          ],
                        }))
                      }
                    >
                      + Add Variants
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rts-btn btn-danger bg-red-500 text-white"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          has_variants: false,
                          variants: [],
                        }))
                      }
                    >
                      ✕ Remove Variants
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="input-main-wrapper">
                {/* Product Name */}
                <div className="single-input">
                  <label htmlFor="productName">Product Name</label>
                  <input
                    type="text"
                    id="productName"
                    placeholder="Quaker Oats Healthy Meal..."
                    value={formData.productName}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Category */}
                <div className="single-input">
                  <label htmlFor="category_id">Category</label>
                  <select
                    id="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="border border-gray-300"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variants */}
                {formData.has_variants ? (
                  <>
                    {formData.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="border p-3 rounded-md mb-3 bg-gray-50"
                      >
                        <div className="single-input">
                          <label>Variant Name</label>
                          <input
                            type="text"
                            placeholder="Variant Name"
                            value={variant.productCategoryName}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "productCategoryName",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="single-input">
                          <label>Regular Price</label>
                          <input
                            type="number"
                            placeholder="Regular Price"
                            value={variant.regularPrice}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "regularPrice",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="single-input">
                          <label>Sale Price</label>
                          <input
                            type="number"
                            placeholder="Sale Price"
                            value={variant.salePrice}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "salePrice",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="single-input">
                          <label>Weight</label>
                          <input
                            type="text"
                            placeholder="e.g. 500g"
                            value={variant.weights}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "weights",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="single-input">
                          <label>Quantity</label>
                          <input
                            type="number"
                            placeholder="Quantity"
                            value={variant.quantity}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {/* <button
                          type="button"
                          className="mt-2 text-red-500"
                          onClick={() => removeVariant(index)}
                        >
                          Remove Variant
                        </button> */}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="rts-btn btn-primary"
                      onClick={addVariant}
                    >
                      + Add Another Variant
                    </button>
                  </>
                ) : (
                  <>
                    <div className="single-input">
                      <label htmlFor="regularPrice">Regular Price</label>
                      <input
                        type="number"
                        id="regularPrice"
                        placeholder="Regular Price"
                        value={formData.regularPrice}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="single-input">
                      <label htmlFor="salePrice">Sale Price</label>
                      <input
                        type="number"
                        id="salePrice"
                        placeholder="Sale Price"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="single-input">
                      <label htmlFor="weights">Weights</label>
                      <input
                        type="text"
                        id="weights"
                        placeholder="Weight (e.g. 500g)"
                        value={formData.weights}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="single-input">
                      <label htmlFor="quantity">Quantity</label>
                      <input
                        type="number"
                        id="quantity"
                        placeholder="Quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                {/* Description */}
                <div className="single-input">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    placeholder="Type something"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Submit */}
                <div className="button-area-botton-wrapper-p-list mt-[20px]">
                  <button type="submit" className="rts-btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="rts-btn btn-primary bg-transparent"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
