"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Heart } from "lucide-react";
import LogoLineLoader from "../loader/LogoLineLoader";
import { useRouter, usePathname } from "next/navigation";

interface ProductType {
  product_id?: number;
  _id?: string;
  slug?: string;
  image?: string;
  productName?: string;
  regularPrice?: string | number;
  salePrice?: string | number;
  description?: string;
  product_variant_id?: number;
}

const PopularProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [wishlistState, setWishlistState] = useState<Record<number, boolean>>(
    {}
  );
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  // ✅ AUTH REDIRECT HELPER
  const redirectIfNotLoggedIn = () => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!token || !user_id) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://ekomart-backend.onrender.com/api/product/getproductbycategory/2"
      );
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD TO CART
  const handleAdd = async (product: ProductType) => {
    if (redirectIfNotLoggedIn()) return;

    const user_id = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("token") || "";

    const productId =
      product.product_id ?? (product._id ? Number(product._id) : null);
    if (!productId) return;

    try {
      const res = await fetch(
        "https://ekomart-backend.onrender.com/api/cart/addcart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id,
            items: [
              {
                product_id: productId,
                product_variant_id: product.product_variant_id || null,
                quantity: 1,
              },
            ],
          }),
        }
      );

      if (!res.ok) return;

      toast.success("Product added to cart!");
      setAddedProductId(productId);
      setTimeout(() => setAddedProductId(null), 1500);
    } catch {
      toast.error("Server error");
    }
  };

  // WISHLIST TOGGLE
  const handleWishlist = async (product: ProductType) => {
    if (redirectIfNotLoggedIn()) return;

    const user_id = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("token") || "";

    const product_id =
      product.product_id ?? (product._id ? Number(product._id) : null);
    if (!product_id) return;

    const alreadyInWishlist = wishlistState[product_id] === true;

    try {
      const res = await fetch(
        alreadyInWishlist
          ? "https://ekomart-backend.onrender.com/api/user/wishlist/remove"
          : "https://ekomart-backend.onrender.com/api/user/wishlist/add",
        {
          method: alreadyInWishlist ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id,
            product_id,
            product_variant_id: product.product_variant_id || null,
          }),
        }
      );

      if (!res.ok) return;

      setWishlistState((prev) => ({
        ...prev,
        [product_id]: !alreadyInWishlist,
      }));
    } catch {
      toast.error("Wishlist update failed");
    }
  };

  return (
    <div className="bg-white max-w-[1430px] w-full mt-[100px] mx-auto">
      {loading ? (
        <LogoLineLoader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const productId =
              product.product_id ?? Number(product._id) ?? index;

            return (
              <div key={productId} className="w-[332px] mx-auto">
                <div className="relative">
                  <img
                    src={"/assets/images/products/Oats.png"}
                    className="w-full h-72 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(product);
                    }}
                    className="absolute bottom-2 right-2"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        wishlistState[productId]
                          ? "fill-[#077D40] text-[#077D40]"
                          : "text-[#333]"
                      }`}
                    />
                  </button>
                </div>

                <p className="mt-2 font-bold">
                  {product.productName || "Organic Product"}
                </p>

                <p className="text-gray-600">
                  ₹{product.regularPrice || "95.00"}
                </p>

                <button
                  onClick={() => handleAdd(product)}
                  className={`mt-4 w-full h-[51px] border ${
                    addedProductId === productId
                      ? "bg-[#077D40] text-white"
                      : "hover:bg-[#077D40] hover:text-white"
                  }`}
                >
                  {addedProductId === productId
                    ? "Added ✅"
                    : "Add to your Cart"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </div>
  );
};

export default PopularProducts;
