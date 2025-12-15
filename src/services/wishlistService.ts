"use client";

import axios from "axios";

export async function addToWishlist(
  user_id: number,
  product_id: number,
  product_variant_id: number
) {
  try {
    const res = await axios.post(
      "https://ekomart-backend.onrender.com/api/user/wishlist/add",
      {
        user_id,
        product_id,
        product_variant_id,
      },
      { withCredentials: true }
    );

    return res.data; // { message: "Added to favourites successfully" }
  } catch (error) {
    console.error("Wishlist Add API Error:", error);
    throw error;
  }
}
