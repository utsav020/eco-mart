// lib/api.ts
import { Product, Category, UpdateProductRequest } from "../types/product";

const API_BASE_URL = "https://ekomart-backend.onrender.com/api";

export const productApi = {
  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await fetch(
      `${API_BASE_URL}/product/getproductbyid/${id}`
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch product: ${response.status} ${errorText}`
      );
    }
    const data = await response.json();
    return data;
  },

  // Update product
  // In your lib/api.ts - updateProduct function
  updateProduct: async (id: number, data: any): Promise<any> => {
    console.log(
      "🔵 Sending update data to server:",
      JSON.stringify(data, null, 2)
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/product/updateproduct/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      // Get the raw response text first
      const responseText = await response.text();
      console.log("🟡 Raw response from server:", responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("❌ JSON parse error:", e);
        responseData = { rawResponse: responseText };
      }

      if (!response.ok) {
        console.error("🔴 Server error details:");
        console.error("- Status:", response.status);
        console.error("- Status Text:", response.statusText);
        console.error("- Response:", responseData);

        // More specific error message
        let errorMessage = `Server Error ${response.status}: `;
        if (responseData.error) {
          errorMessage += responseData.error;
        } else if (responseData.message) {
          errorMessage += responseData.message;
        } else {
          errorMessage += "Unknown server error occurred";
        }

        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error: any) {
      console.error("🔴 Network/API error:", error);
      throw error; // Re-throw to handle in component
    }
  },

  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories/getallcategory`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch categories: ${response.status} ${errorText}`
      );
    }
    const data = await response.json();
    return data;
  },
};
