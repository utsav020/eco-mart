"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

interface Category {
  id: number;
  categoryName: string;
  description?: string;
  image?: string;
}

interface Props {
  params: { id: string };
}

const CategoryDetailPage = ({ params }: Props) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch category by ID from API
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `https://ekomart-backend.onrender.com/api/categories/getcategorybyid/${params.id}`
        );

        // ✅ API returns category object
        if (response.data) {
          setCategory(response.data);
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to fetch category details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📌 Category Detail</h1>

      {category && (
        <div className="space-y-4">
          <p>
            <b>ID:</b> {category.id}
          </p>
          <p>
            <b>Name:</b> {category.categoryName}
          </p>
          <p>
            <b>Description:</b> {category.description || "No description"}
          </p>

          {category.image && (
            <div>
              <b>Image:</b>
              <div className="mt-2">
                <Image
                  src={category.image}
                  alt={category.categoryName}
                  width={200}
                  height={200}
                  className="rounded border"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDetailPage;
