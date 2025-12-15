"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Heart, Trash2 } from "lucide-react"; // ⭐ NEW ICON
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "@/components/header/CartContext";
import { getUserId } from "@/lib/auth";

interface WishlistItem {
  _id: any;
  wishlist_id: number;
  product_id: number;
  productName: string;
  product_variant_id: number;
  image_url: string;
  price: number;
  product_description: string;
}

export default function WishlistMain() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  const user_id = getUserId();

  // ⭐ Fetch Wishlist Items from backend
  const fetchWishlist = async () => {
    if (!user_id) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://ekomart-backend.onrender.com/api/user/wishlist/${user_id}`
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load wishlist");
        return;
      }

      setWishlistItems(data);
    } catch (err) {
      toast.error("Server error fetching wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ⭐ REMOVE One Item
  const removeFromWishlist = async (product_id: number) => {
    try {
      const res = await fetch(
        "https://ekomart-backend.onrender.com/api/user/wishlist/remove",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, product_id }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to remove");
        return;
      }

      toast.success("Removed from wishlist");
      setWishlistItems((prev) =>
        prev.filter((item) => item.product_id !== product_id)
      );
    } catch (err) {
      toast.error("Server error while removing");
    }
  };

  // ⭐ NEW — REMOVE ALL WISHLIST ITEMS
  const clearAllWishlist = async () => {
    if (!user_id) return;

    try {
      const res = await fetch(
        `https://ekomart-backend.onrender.com/api/user/wishlist/allclear/${user_id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to clear wishlist");
        return;
      }

      toast.success("All favourites cleared!");

      // Clear UI instantly
      setWishlistItems([]);
    } catch (err) {
      toast.error("Server error while clearing wishlist");
    }
  };

  // ⭐ Add To Cart
  const handleAdd = async (product: WishlistItem, index: number) => {
    const user_id = Number(localStorage.getItem("user_id"));

    if (!user_id || isNaN(user_id)) {
      toast.error("User not logged in. Please login first.");
      return;
    }

    const token = localStorage.getItem("token") || "";

    const productId = product.product_id ?? Number(product._id);

    if (!productId) {
      toast.error("Invalid product id.");
      return;
    }

    const payload = {
      user_id,
      items: [
        {
          product_id: productId,
          product_variant_id: product.product_variant_id || null,
          quantity: 1,
        },
      ],
    };

    try {
      const res = await fetch(
        "https://ekomart-backend.onrender.com/api/cart/addcart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Unable to add to cart");
        return;
      }

      toast.success("Product added to cart!");
      setAddedProductId(productId);
      setTimeout(() => setAddedProductId(null), 1500);
    } catch (error) {
      toast.error("Server Error: Unable to add to cart");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1430px] mx-auto px-0 sm:px-6 lg:px-0">

        {/* ⭐ NEW — CLEAR ALL BUTTON */}
        {wishlistItems.length > 0 && (
          <div className="flex justify-end pr-5 mt-8">
            <button
              onClick={clearAllWishlist}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              <Trash2 className="w-5 h-5" />
              Clear All Wishlist
            </button>
          </div>
        )}

        {/* Empty Message */}
        {wishlistItems.length === 0 && !loading ? (
          <div className="p-10 bg-white text-center text-gray-500 text-lg rounded-lg shadow">
            Your wishlist is empty.
          </div>
        ) : null}

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
          {wishlistItems.map((item, index) => (
            <div
              key={item.wishlist_id}
              className="relative h-[450px] w-[331px] transition duration-300 mx-auto"
            >
              {/* Discount badge */}
              <div className="absolute top-4 right-4 bg-[#077D40] text-white text-[14px] px-3 py-1 rounded-full z-10">
                Save 20%
              </div>

              {/* Product Image */}
              <div className="relative flex justify-center items-center">
                <img
                  src={item.image_url || "/assets/images/products/Oats.png"}
                  alt={item.productName}
                  className="w-[331.75px] h-72 object-cover"
                />

                {/* Remove heart */}
                <button
                  onClick={() => removeFromWishlist(item.product_id)}
                  className="absolute cursor-pointer bottom-2 right-2 p-2 rounded-full"
                >
                  <Heart className="w-6 h-6 text-green-600 fill-green-600" />
                </button>
              </div>

              {/* Details */}
              <div className="pt-3">
                <p className="font-bold text-[14px] truncate">
                  {item.productName}
                </p>

                <p className="text-gray-600 text-[14px] mt-2">
                  Rs. {item.price}
                </p>

                {/* Add to Cart */}
                <button
                  className={`mt-5 w-full h-[45px] border border-black rounded hover:bg-[#077D40] hover:text-white transition ${
                    addedProductId === item.product_id
                      ? "bg-[#077D40] text-white"
                      : ""
                  }`}
                  onClick={() => handleAdd(item, index)}
                >
                  {addedProductId === item.product_id
                    ? "Added ✓"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        )}
      </div>
    </div>
  );
}
