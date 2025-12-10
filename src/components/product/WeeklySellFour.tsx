"use client";

import React, { useEffect, useState } from "react";
// import { useCart } from "../header/CartContext";
import { useWishlist } from "../header/WishlistContext";
import { toast, ToastContainer } from "react-toastify";
import { Heart } from "lucide-react";
import LogoLineLoader from "../loader/LogoLineLoader";

interface ProductType {
  product_variant_id: null;
  product_id: number | undefined;
  _id?: string;
  slug?: string;
  image?: string;
  productName?: string;
  regularPrice?: string | number;
  salePrice?: string | number;
  description?: string;
}

const PopularProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("tab1");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();

  // ✅ Default fallback images
  const defaultImages = [
    "/Soyabean.png",
    "/Oats.png",
    "/CornSeed.png",
    "/Moong.png",
    "/MultigrainAtta.png",
  ];

  // ✅ Category IDs
  const categoryIds: Record<string, number> = {
    tab1: 1,
    tab2: 2,
    tab3: 3,
    tab4: 4,
  };

  // ✅ Fetch products by category ID
  const fetchProductsByCategory = async (categoryId: number) => {
    setLoading(true);
    setError("");
    try {
      const url = `https://ekomart-backend.onrender.com/api/product/getproductbycategory/${categoryId}`;
      const res = await fetch(url);
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

  // ✅ Fetch default category (tab1) on mount
  useEffect(() => {
    fetchProductsByCategory(categoryIds["tab1"]);
  }, []);

  // ✅ Change tab and fetch new products
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    fetchProductsByCategory(categoryIds[tabId]);
  };

  // ✅ Safely get product image
  const getImage = (image: string | undefined, index: number) => {
    return image && image.trim() !== ""
      ? image
      : defaultImages[index % defaultImages.length];
  };

  // ✅ Add to Cart
  const [addedProductId, setAddedProductId] = useState<string | number | null>(
    null
  );

  // ⭐ Add To Cart (FINAL FIXED)
    const handleAdd = async (product: ProductType, index: number) => {
      const userId = Number(localStorage.getItem("user_id"));
  
      if (!userId || isNaN(userId)) {
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
        user_id: userId,
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

  // ✅ Add / Remove Wishlist (toggle)
  const handleWishlist = (product: ProductType, index: number) => {
    const productIdNumber =
      product.product_id ??
      (product._id ? Number(product._id) : undefined) ??
      Date.now();

    const isInWishlist = wishlistItems.some(
      (item) => String(item.id) === String(productIdNumber)
    );

    if (isInWishlist) {
      removeFromWishlist(productIdNumber);
      toast.info("💔 Removed from wishlist!");
      return;
    }

    addToWishlist({
      id: productIdNumber,
      image: getImage(product.image, index),
      title: product.productName || "Product",
      price: parseFloat(product.regularPrice?.toString() ?? "0"),
      quantity: 1,
    });
    toast.success("💖 Added to wishlist!");
  };

  return (
    <div className="bg-white max-w-[1430px] px-0 2xl:px-0 w-full mt-[100px] mx-auto">
      {/* ✅ Title */}
      <div className="mb-10 lg:pl-0 pl-7 px-[15px] md:px-5 lg:px-0">
        <p className="md:text-[35px] text-[30px] font-bold text-[#2D2D2D] mb-2">
          Best Sellers
        </p>
        <p className="text-[#2D2D2D] text-[18px] md:text-[30px]">
          Naturally grown, carefully selected Products
        </p>
      </div>

      {/* ✅ Product Grid */}
      {loading ? (
        // <div className="flex justify-center items-center py-10">
        //   <div className="animate-spin h-8 w-8 border-4 border-[#A3C526] border-t-transparent rounded-full"></div>
        // </div>

        <div className="">
          <LogoLineLoader />
        </div>
      ) : error ? (
        <p className="text-center text-gray-500 py-10">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const productIdNumber =
              product.product_id ??
              (product._id ? Number(product._id) : undefined) ??
              index;
            const isInWishlist = wishlistItems.some(
              (item) => String(item.id) === String(productIdNumber)
            );

            return (
              <div
                key={product._id || index}
                className="relative max-w-[1430px] mx-auto transition w-[332px] duration-300 group"
              >
                {/* Save badge */}
                <div className="absolute top-4 right-3 bg-[#077D40] flex items-center justify-center text-white text-[15px] font-bold w-[100px] h-[33px] rounded-full z-10">
                  Save 20%
                </div>

                {/* Product image */}
                <div className="relative flex justify-center items-center">
                  <img
                    src={"/assets/images/products/Oats.png"}
                    alt={product.productName || "Product"}
                    className="w-[331.75px] h-72 object-cover"
                  />

                  {/* Wishlist icon */}
                  <div className="absolute bottom-1 right-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlist(product, index);
                      }}
                      className={`p-2 rounded-full transition ${
                        isInWishlist
                          
                      }`}
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
                </div>

                {/* Product details */}
                <div className="">
                  <div className="flex justify-between items-center mt-2">
                    <div className="">
                      <p className="text-[14px] font-bold text-[#000000] truncate">
                      {product.productName || "Organic Product"}
                    </p>
                    </div>
                    <div className="flex text-[16px]">★★★★★</div>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <div className="">
                      <p className="text-gray-600 text-[14px]">
                      {product.regularPrice
                        ? `₹${product.regularPrice}`
                        : "₹95.00"}
                    </p>
                    </div>
                    <div className="">
                      <p className="text-[12px] text-gray-400">
                      4.86 (887k Reviews)
                    </p>
                    </div>
                  </div>

                  {/* Add to cart */}
                  <div className="mt-[25px] w-[332px] hover:text-white text-[14px] h-[51px]">
                    <button
                      className={`w-full h-[51px] border border-[#00000080] hover:bg-[#077D40] hover:text-white transition ${
                        addedProductId === (product._id || index)
                          ? "bg-[#077D40] text-white"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdd(product, index);
                      }}
                    >
                      {addedProductId === (product._id || index)
                        ? "Added ✅"
                        : "Add to your Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default PopularProducts;
function addToCart(arg0: { id: number; product_variant_id: null; productName: string | undefined; price: number; regularPrice: string | number | undefined; productImage: string; image: string; quantity: number; active: boolean; description: string; title: undefined; }, userId: number) {
  throw new Error("Function not implemented.");
}

