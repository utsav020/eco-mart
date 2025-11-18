"use client";

import React, { useState, useRef } from "react";
import { Upload, TextAlignStart } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const EditProductPage = () => {
  const router = useRouter();

  const [basicInfo, setBasicInfo] = useState({
    name: "Cashew",
    category: "Dried Fruit",
    description:
      "Premium quality cashews with rich flavor and crunchy texture. Perfect for snacking, cooking, and baking.",
  });

  const [productDetails, setProductDetails] = useState<string[]>([
    "Cashews are a versatile snack that adds a delicious crunch to any dish.",
    "Our premium cashews are packed with healthy fats and essential nutrients.",
    "Perfect for snacking, baking, or adding to dishes for added crunch.",
    "We offer only the highest quality cashews, handpicked and processed for the best flavor.",
  ]);

  const [highlights, setHighlights] = useState<string[]>([
    "Rich in healthy fats",
    "Great for snacking",
  ]);

  const [features, setFeatures] = useState<string[]>([
    "Handpicked for premium quality",
  ]);

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle text changes for basic info
  const handleBasicChange = (field: string, value: string) => {
    setBasicInfo({ ...basicInfo, [field]: value });
  };

  // Add new items
  const addProductDetail = () => setProductDetails([...productDetails, ""]);
  const addHighlight = () => setHighlights([...highlights, ""]);
  const addFeature = () => setFeatures([...features, ""]);

  // Remove items
  const removeHighlight = (idx: number) =>
    setHighlights(highlights.filter((_, i) => i !== idx));
  const removeFeature = (idx: number) =>
    setFeatures(features.filter((_, i) => i !== idx));

  // Handle image uploads
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "gallery" | "additional"
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (type === "main") {
      setMainImage(URL.createObjectURL(files[0]));
    } else {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      if (type === "gallery") {
        setGalleryImages([...galleryImages, ...newImages]);
      } else {
        setAdditionalImages([...additionalImages, ...newImages]);
      }
    }
  };

  // Handle image removal
  const removeImage = (
    type: "main" | "gallery" | "additional",
    index?: number
  ) => {
    if (type === "main") {
      setMainImage(null);
    } else if (type === "gallery" && index !== undefined) {
      const newImages = [...galleryImages];
      newImages.splice(index, 1);
      setGalleryImages(newImages);
    } else if (type === "additional" && index !== undefined) {
      const newImages = [...additionalImages];
      newImages.splice(index, 1);
      setAdditionalImages(newImages);
    }
  };

  // API call to update product/category
  const handleUpdateProduct = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        categoryName: basicInfo.category,
        description: basicInfo.description,
        productName: basicInfo.name,
        details: productDetails,
        highlights,
        features,
        mainImage,
        galleryImages,
        additionalImages,
      };

      const res = await axios.put(
        `https://ekomart-backend.onrender.com/api/categories/updatecategory/6`,
        payload
      );

      if (res.status === 200) {
        setSuccessMsg("Product updated successfully!");
        setTimeout(() => {
          router.push("/dashboard/product-list");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      setErrorMsg(error.response?.data?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // Image Upload Section component
  const ImageUploadSection = ({
    title,
    type,
    images,
    onUpload,
    onRemove,
    description,
  }: {
    title: string;
    type: "main" | "gallery" | "additional";
    images: string | string[];
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: (index?: number) => void;
    description?: string;
  }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
      <div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="font-semibold text-lg mb-2">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600 mb-4">{description}</p>
          )}

          {/* Image Preview */}
          <div className="mb-4">
            {type === "main" ? (
              images ? (
                <div className="relative inline-block group">
                  <img
                    src={images as string}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    alt="Main product"
                  />
                  <button
                    onClick={() => onRemove()}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : null
            ) : (
              <div className="flex flex-wrap gap-3">
                {(images as string[]).map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={src}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      alt={`Gallery ${idx + 1}`}
                    />
                    <button
                      onClick={() => onRemove(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-green-700 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-3 text-green-700 text-base font-medium">
              <Upload size={20} />{" "}
              {type === "main" ? "Choose File" : "Choose Files"}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onUpload}
              multiple={type !== "main"}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <p className="text-gray-600 text-lg">
            Update your product details and settings
          </p>
        </div>

        {/* Alerts */}
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="font-semibold text-xl mb-6 pb-3 border-b border-gray-200 text-gray-800">
                Basic Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={basicInfo.name}
                    onChange={(e) =>
                      handleBasicChange("name", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    value={basicInfo.category}
                    onChange={(e) =>
                      handleBasicChange("category", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={basicInfo.description}
                    onChange={(e) =>
                      handleBasicChange("description", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 h-36 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-vertical text-gray-800"
                    placeholder="Describe your product..."
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="mb-6 pb-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-xl text-gray-800">
                  Product Details
                </h2>
                <button
                  onClick={addProductDetail}
                  className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition"
                >
                  <span className="text-xl">+</span> Add Detail
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {productDetails.map((detail, idx) => (
                  <div
                    key={idx}
                    className="relative bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-green-300 transition"
                  >
                    <textarea
                      value={detail}
                      onChange={(e) => {
                        const newDetails = [...productDetails];
                        newDetails[idx] = e.target.value;
                        setProductDetails(newDetails);
                      }}
                      className="w-full border-none bg-transparent resize-none focus:outline-none focus:ring-0 min-h-[120px] text-gray-800 placeholder-gray-400"
                      placeholder="Enter product detail..."
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights & Features */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-6 gap-4">
                <TextAlignStart />
                <h2 className="font-semibold text-xl text-gray-800">
                  Highlights & Features
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Highlights */}
                <div>
                  <div className="flex flex-wrap gap-3">
                    {highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-center w-full bg-gray-100 rounded-lg px-3 py-2"
                      >
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => {
                            const newHighlights = [...highlights];
                            newHighlights[idx] = e.target.value;
                            setHighlights(newHighlights);
                          }}
                          className="bg-transparent border-none focus:outline-none text-gray-800"
                        />
                        <button
                          onClick={() => removeHighlight(idx)}
                          className="ml-2 text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addHighlight}
                      className="px-4 py-2 border border-dashed border-green-500 text-green-600 rounded-lg hover:bg-green-50"
                    >
                      + Add Highlight
                    </button>
                  </div>
                </div>
                {/* Features */}
                <div>
                  <div className="flex flex-wrap gap-3">
                    {features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center w-full bg-gray-100 rounded-lg px-3 py-2"
                      >
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...features];
                            newFeatures[idx] = e.target.value;
                            setFeatures(newFeatures);
                          }}
                          className="bg-transparent border-none focus:outline-none text-gray-800"
                        />
                        <button
                          onClick={() => removeFeature(idx)}
                          className="ml-2 text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addFeature}
                      className="px-4 py-2 border border-dashed border-green-500 text-green-600 rounded-lg hover:bg-green-50"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-8">
            <ImageUploadSection
              title="Main Image"
              type="main"
              images={mainImage ?? ""}
              onUpload={(e) => handleImageUpload(e, "main")}
              onRemove={() => removeImage("main")}
              description="Primary product image displayed on product page"
            />
            <ImageUploadSection
              title="Gallery Images"
              type="gallery"
              images={galleryImages}
              onUpload={(e) => handleImageUpload(e, "gallery")}
              onRemove={(index) => removeImage("gallery", index)}
              description="Additional product images for gallery"
            />
            <ImageUploadSection
              title="Additional Images"
              type="additional"
              images={additionalImages}
              onUpload={(e) => handleImageUpload(e, "additional")}
              onRemove={(index) => removeImage("additional", index)}
              description="Extra images for detailed views"
            />
            {/* Update & Cancel Buttons */}
            <div className="flex flex-col rounded-xl bg-green-600 gap-4 mt-12">
              <button
                onClick={handleUpdateProduct}
                disabled={loading}
                className="w-full text-white px-8 py-3 rounded-xl transition font-semibold text-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
            <div className="bg-green-600 rounded-xl">
              <button
                onClick={() => router.push("/dashboard/product-list")}
                className="w-full text-white px-8 py-3 rounded-xl transition font-semibold text-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
