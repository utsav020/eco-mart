"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

const EditProductPage = () => {
  const router = useRouter();
  const { product_id } = useParams();

  /* ---------------- STATES ---------------- */

  const [basicInfo, setBasicInfo] = useState({
    productName: "",
    category_id: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    weights: "",
    quantity: "",
  });

  const [details, setDetails] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (field: string, value: string) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => setter((prev) => [...prev, ""]);

  const removeItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  /* ---------------- UPDATE PRODUCT ---------------- */

  const handleUpdateProduct = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      /* =========================
         API 1: UPDATE BASIC PRODUCT
         ========================= */

      const productForm = new FormData();

      productForm.append("productName", basicInfo.productName);
      productForm.append("category_id", basicInfo.category_id);
      productForm.append("description", basicInfo.description);

      if (basicInfo.regularPrice)
        productForm.append("regularPrice", basicInfo.regularPrice);

      if (basicInfo.salePrice)
        productForm.append("salePrice", basicInfo.salePrice);

      if (basicInfo.weights)
        productForm.append("weights", basicInfo.weights);

      if (basicInfo.quantity)
        productForm.append("quantity", basicInfo.quantity);

      /* Prevent backend filter() crash */
      productForm.append("details", JSON.stringify([]));
      productForm.append("highlights", JSON.stringify([]));
      productForm.append("features", JSON.stringify([]));

      await axios.put(
        `https://ekomart-backend.onrender.com/api/product/updateproduct/${product_id}`,
        productForm
      );

      /* =========================
         API 2: UPDATE PRODUCT INFO
         ========================= */

      const infoPayload = {
        details: details.filter(Boolean),
        highlights: highlights.filter(Boolean),
        features: features.filter(Boolean),
      };

      await axios.put(
        `https://ekomart-backend.onrender.com/api/product/updateproductinfo/${product_id}`,
        infoPayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccessMsg("✅ Product updated successfully");

      setTimeout(() => {
        router.push("/dashboard/product-list");
      }, 1500);
    } catch (error: any) {
      setErrorMsg(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "❌ Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border">
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {successMsg}
          </div>
        )}

        <div className="space-y-4">
          <input
            className="w-full border p-3 rounded"
            placeholder="Product Name"
            value={basicInfo.productName}
            onChange={(e) =>
              handleChange("productName", e.target.value)
            }
          />

          <input
            className="w-full border p-3 rounded"
            placeholder="Category ID"
            value={basicInfo.category_id}
            onChange={(e) =>
              handleChange("category_id", e.target.value)
            }
          />

          <textarea
            className="w-full border p-3 rounded h-28"
            placeholder="Description"
            value={basicInfo.description}
            onChange={(e) =>
              handleChange("description", e.target.value)
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="border p-3 rounded"
              placeholder="Regular Price"
              value={basicInfo.regularPrice}
              onChange={(e) =>
                handleChange("regularPrice", e.target.value)
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Sale Price"
              value={basicInfo.salePrice}
              onChange={(e) =>
                handleChange("salePrice", e.target.value)
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Weight (ex: 500g)"
              value={basicInfo.weights}
              onChange={(e) =>
                handleChange("weights", e.target.value)
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Quantity"
              value={basicInfo.quantity}
              onChange={(e) =>
                handleChange("quantity", e.target.value)
              }
            />
          </div>

          {/* -------- DETAILS / HIGHLIGHTS / FEATURES -------- */}

          {[
            { label: "Details", data: details, set: setDetails },
            {
              label: "Highlights",
              data: highlights,
              set: setHighlights,
            },
            {
              label: "Features",
              data: features,
              set: setFeatures,
            },
          ].map(({ label, data, set }) => (
            <div key={label}>
              <h3 className="font-semibold mb-2">{label}</h3>
              {data.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    className="flex-1 border p-2 rounded"
                    value={item}
                    onChange={(e) =>
                      handleArrayChange(set, i, e.target.value)
                    }
                  />
                  <button
                    onClick={() => removeItem(set, i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem(set)}
                className="text-sm text-green-600"
              >
                + Add {label}
              </button>
            </div>
          ))}

          <button
            onClick={handleUpdateProduct}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>

          <button
            onClick={() => router.push("/dashboard/product-list")}
            className="w-full bg-gray-400 text-white py-3 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
