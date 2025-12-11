"use client";

import React, { useEffect, useState } from "react";
// import { useCart } from "../header/CartContext";
import { useWishlist } from "../header/WishlistContext";
import { toast, ToastContainer } from "react-toastify";
import { Heart } from "lucide-react";
import LogoLineLoader from "../loader/LogoLineLoader";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();

  const defaultImages = [
    "/Soyabean.png",
    "/Oats.png",
    "/CornSeed.png",
    "/Moong.png",
    "/MultigrainAtta.png",
  ];

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://ekomart-backend.onrender.com/api/product/getproductbycategory/2"
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        setError("No products found for this category.");
        setProducts([]);
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // RETURN VALID PRODUCT IMAGE
  const getImage = (image: string | undefined, index: number) => {
    return image && image.trim() !== ""
      ? image
      : defaultImages[index % defaultImages.length];
  };

  // ADD TO CART
  const [addedProductId, setAddedProductId] = useState<number | string | null>(
    null
  );

  // ⭐ Add To Cart (FINAL FIXED)
    const handleAdd = async (product: ProductType, index: number) => {
      const user_id = Number(localStorage.getItem("user_id"));
  
      if (!user_id || isNaN(user_id)) {
        toast.error("User not logged in. Please login first.");
        return;
      }
  
      const token = localStorage.getItem("token") || "";
  
      // ⭐ Correct product_id mapping
      const productId = product.product_id
        ? product.product_id
        : product._id
        ? Number(product._id)
        : null;
  
      if (!productId) {
        toast.error("Invalid product id.");
        return;
      }
  
      // ⭐ Correct payload format
      const payload = {
        user_id: user_id,
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
  
        // ⭐ UI Local update (NO second API CALL)
        toast.success("Product added to cart!");
  
        setAddedProductId(productId);
        setTimeout(() => setAddedProductId(null), 1500);
      } catch (error) {
        toast.error("Server Error: Unable to add to cart");
      }
    };

  // WISHLIST TOGGLE
  const handleWishlist = (product: ProductType, index: number) => {
    const productId =
      product.product_id ??
      (product._id ? Number(product._id) : Date.now());

    const exists = wishlistItems.some(
      (item) => String(item.id) === String(productId)
    );

    if (exists) {
      removeFromWishlist(productId);
      toast.info("💔 Removed from wishlist!");
      return;
    }

    addToWishlist({
      id: productId,
      image: getImage(product.image, index),
      title: product.productName || "Product",
      price: Number(product.regularPrice || 0),
      quantity: 1,
    });

    toast.success("💖 Added to wishlist!");
  };

  return (
    <div className="bg-white max-w-[1430px] w-full mt-[100px] mx-auto">

      <div className="mb-10 px-[15px] md:px-5 lg:px-0">
        <p className="md:text-[35px] text-[30px] font-bold text-[#2D2D2D] mb-2">
          Shop Our Products
        </p>
        <p className="text-[#2D2D2D] text-[18px] md:text-[30px]">
          Naturally grown, carefully selected Products
        </p>
      </div>

      {loading ? (
        <LogoLineLoader />
      ) : error ? (
        <p className="text-center text-gray-500 py-10">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const productId =
              product.product_id ??
              (product._id ? Number(product._id) : index);

            const isInWishlist = wishlistItems.some(
              (item) => String(item.id) === String(productId)
            );

            return (
              <div
                key={product._id || index}
                className="relative w-[332px] mx-auto group"
              >
                {/* SAVE BADGE */}
                <div className="absolute top-4 right-3 bg-[#077D40] flex items-center justify-center text-white text-[15px] font-bold w-[100px] h-[33px] rounded-full z-10">
                  Save 20%
                </div>

                {/* PRODUCT IMAGE */}
                <div className="relative flex justify-center items-center">
                  <img
                    src={"/assets/images/products/Oats.png"}
                    alt={product.productName || "Product"}
                    className="w-[331.75px] h-72 object-cover"
                  />

                  {/* WISHLIST */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(product, index);
                    }}
                    className="absolute bottom-2 right-2 p-2 rounded-full"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isInWishlist
                          ? "fill-[#077D40] text-[#077D40]"
                          : "text-[#333333]"
                      }`}
                    />
                  </button>
                </div>

                {/* DETAILS */}
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] font-bold text-black truncate">
                      {product.productName || "Organic Product"}
                    </p>
                    <div className="text-[16px]">★★★★★</div>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-600 text-[14px]">
                      ₹{product.regularPrice || "95.00"}
                    </p>
                    <p className="text-[12px] text-gray-400">
                      4.86 (887k Reviews)
                    </p>
                  </div>

                  {/* ADD TO CART BUTTON */}
                  <button
                    className={`mt-4 w-full h-[51px] border border-[#00000080] hover:bg-[#077D40] hover:text-white transition ${
                      addedProductId === productId
                        ? "bg-[#077D40] text-white"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(product, index);
                    }}
                  >
                    {addedProductId === productId ? "Added ✅" : "Add to your Cart"}
                  </button>
                </div>
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
