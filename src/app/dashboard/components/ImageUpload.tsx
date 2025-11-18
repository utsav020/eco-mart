"use client";

import React, { useState } from "react";

interface ImageUploadProps {
  title: string;
  multiple?: boolean;
  description?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  title,
  multiple = false,
  description,
}) => {
  const [preview, setPreview] = useState<string | string[]>(multiple ? [] : "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    if (multiple) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreview(filesArray);
    } else {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
        <div className="text-gray-400 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        {/* <p className="text-sm text-gray-600 mb-2">Drag & drop images here or click to browse</p>
            <p className="text-xs text-gray-400 mb-4">Supports JPG, PNG, WEBP - Max 5MB each</p> */}

        <label className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer text-sm font-medium">
          Choose Files
          <input
            type="file"
            onChange={handleChange}
            multiple={multiple}
            className="hidden"
            accept="image/*"
          />
        </label>
      </div>

      {/* Preview Images */}
      <div className="mt-4">
        {multiple ? (
          <div className="flex flex-wrap gap-3">
            {(preview as string[]).map((src, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={src}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const newPreviews = (preview as string[]).filter(
                      (_, i) => i !== idx
                    );
                    setPreview(newPreviews);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          preview && (
            <div className="relative inline-block group">
              <img
                src={preview as string}
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setPreview("")}
              >
                ×
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
