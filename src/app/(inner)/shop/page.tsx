"use client";
import React, { useState, useEffect } from "react";
import HeaderThree from "@/components/header/HeaderThree";
import { Heart, ChevronDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FooterTwo from "@/components/footer/FooterTwo";
import { usePathname, useRouter } from "next/navigation";
import { useProduct } from "@/components/context/page";
import { ProductImage } from "@/app/dashboard/types/product";
import LogoLineLoader from "@/components/loader/LogoLineLoader";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

/* ---------------- TYPES ---------------- */
interface ProductType {
  _id?: string;
  product_id?: number;
  productName: string;
  regularPrice?: number | null;
  productImages?: ProductImage[];
  image?: string;
  product_variant_id?: number | null;
}

interface CategoryType {
  category_id: number;
  categoryName: string;
}

interface WishlistResponse {
  iswishlist: boolean;
}

export default function BlogGridMain() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wishlistState, setWishlistState] = useState<Record<number, boolean>>({});
  const router = useRouter();
  const pathname = usePathname();
  const { setSelectedProduct } = useProduct();
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const defaultImages = ["/assets/images/products/Oats.png"];

  /* ---------------- LOCAL STORAGE HELPERS ---------------- */
  const getWishlistFromStorage = (): Record<number, boolean> => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem("user_wishlist");
    return stored ? JSON.parse(stored) : {};
  };

  /* ---------------- Save Wishlist To Storage ---------------- */
  const saveWishlistToStorage = (wishlist: Record<number, boolean>) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("user_wishlist", JSON.stringify(wishlist));
  };

  /* ---------------- Update Wishlist In Storage ---------------- */
  const updateWishlistInStorage = (
    productId: number,
    isWishlisted: boolean
  ) => {
    const currentWishlist = getWishlistFromStorage();
    const updatedWishlist = {
      ...currentWishlist,
      [productId]: isWishlisted,
    };
    saveWishlistToStorage(updatedWishlist);
    return updatedWishlist;
  };

  /* ---------------- LOGIN CHECK ---------------- */
  const redirectIfNotLoggedIn = () => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    if (!token || !user_id) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  };

  /* ---------------- FETCH CATEGORIES ---------------- */
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://ekomart-backend.onrender.com/api/categories/getallcategory"
      );
      setCategories(await res.json());
    } catch {
      toast.error("Failed to load categories");
    }
  };

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = async (categoryId?: number) => {
    setLoading(true);
    setError("");

    try {
      const url = categoryId
        ? `https://ekomart-backend.onrender.com/api/product/getproductbycategory/${categoryId}`
        : `https://ekomart-backend.onrender.com/api/product/getallproducts`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data || []);

      // Check wishlist status after fetching products
      if (data && data.length > 0) {
        await checkWishlistStatus(data);
      }
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- WISHLIST CHECK - Updated for exact response format ---------------- */
  const checkWishlistStatus = async (productList: ProductType[]) => {
    const user_id = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("token") || "";

    // Get stored wishlist first for immediate UI update
    const storedWishlist = getWishlistFromStorage();

    if (!user_id || !token) {
      // Not logged in - clear all wishlist states
      const initialWishlistState: Record<number, boolean> = {};
      productList.forEach((product) => {
        const product_id =
          product.product_id ?? (product._id ? Number(product._id) : null);
        if (product_id) {
          initialWishlistState[product_id] = false;
        }
      });
      setWishlistState(initialWishlistState);
      saveWishlistToStorage(initialWishlistState);
      return;
    }

    try {
      // Get all product IDs
      const productIds = productList
        .map(
          (product) =>
            product.product_id ?? (product._id ? Number(product._id) : null)
        )
        .filter((id) => id !== null) as number[];

      if (productIds.length === 0) return;

      // First, set wishlist state from storage for immediate UI
      const initialState: Record<number, boolean> = {};
      productIds.forEach((productId) => {
        initialState[productId] = storedWishlist[productId] || false;
      });
      setWishlistState(initialState);

      // Then verify with API
      const statusMap: Record<number, boolean> = {};

      // Check each product individually
      for (const productId of productIds) {
        try {
          const res = await fetch(
            `https://ekomart-backend.onrender.com/api/user/wishlist-check?user_id=${user_id}&product_id=${productId}&variant=0`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (res.ok) {
            const data: WishlistResponse = await res.json();

            // Handle exact response format: {"iswishlist": true/false}
            const isWishlisted = data?.iswishlist === true;

            statusMap[productId] = isWishlisted;

            // Update localStorage with correct state
            if (isWishlisted !== storedWishlist[productId]) {
              updateWishlistInStorage(productId, isWishlisted);
            }
          } else {
            // If API fails, keep the stored state
            statusMap[productId] = storedWishlist[productId] || false;
          }
        } catch (error) {
          // If request fails, keep the stored state
          statusMap[productId] = storedWishlist[productId] || false;
        }
      }

      // Update state with verified status
      setWishlistState(statusMap);
      saveWishlistToStorage(statusMap);
    } catch (error) {
      console.error("Error checking wishlist:", error);
      // Keep stored state if API fails completely
      setWishlistState(storedWishlist);
    }
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    fetchCategories();
    fetchProducts();

    // Load wishlist from storage on initial mount
    const storedWishlist = getWishlistFromStorage();
    setWishlistState(storedWishlist);
  }, []);

  /* ---------------- ADD TO CART ---------------- */
  const handleAdd = async (product: ProductType) => {
    if (redirectIfNotLoggedIn()) return;

    const user_id = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("token") || "";
    const product_id =
      product.product_id ?? (product._id ? Number(product._id) : null);

    if (!product_id) {
      toast.error("Invalid product ID");
      return;
    }

    try {
      const response = await fetch(
        "https://ekomart-backend.onrender.com/api/cart/addcart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id,
            items: [{ product_id, quantity: 1 }],
          }),
        }
      );

      if (response.ok) {
        toast.success("Added to cart");
        setAddedProductId(product_id);
        setTimeout(() => setAddedProductId(null), 1200);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add to cart");
      }
    } catch {
      toast.error("Server error");
    }
  };

  /* ---------------- WISHLIST TOGGLE - Updated for exact response format ---------------- */
  const handleWishlist = async (product: ProductType) => {
    if (redirectIfNotLoggedIn()) return;

    const user_id = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("token") || "";
    const product_id =
      product.product_id ?? (product._id ? Number(product._id) : null);

    if (!product_id) {
      toast.error("Invalid product ID");
      return;
    }

    const isCurrentlyWishlisted = wishlistState[product_id] || false;
    const method = isCurrentlyWishlisted ? "DELETE" : "POST";
    const endpoint = isCurrentlyWishlisted
      ? "https://ekomart-backend.onrender.com/api/user/wishlist/remove"
      : "https://ekomart-backend.onrender.com/api/user/wishlist/add";

    // Optimistically update UI
    const newWishlistState = {
      ...wishlistState,
      [product_id]: !isCurrentlyWishlisted,
    };
    setWishlistState(newWishlistState);

    // Update localStorage immediately
    updateWishlistInStorage(product_id, !isCurrentlyWishlisted);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id,
          product_id,
          ...(!isCurrentlyWishlisted && { variant: 0 }),
        }),
      });

      if (response.ok) {
        toast.success(
          isCurrentlyWishlisted ? "Removed from wishlist" : "Added to wishlist"
        );

        // Verify the action with API after a short delay
        setTimeout(async () => {
          try {
            const verifyRes = await fetch(
              `https://ekomart-backend.onrender.com/api/user/wishlist-check?user_id=${user_id}&product_id=${product_id}&variant=0`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.ok) {
              const data: WishlistResponse = await verifyRes.json();
              const actualIsWishlisted = data?.iswishlist === true;

              if (actualIsWishlisted !== !isCurrentlyWishlisted) {
                setWishlistState((prev) => ({
                  ...prev,
                  [product_id]: actualIsWishlisted,
                }));
                updateWishlistInStorage(product_id, actualIsWishlisted);
              }
            }
          } catch (error) {
            console.error("Verification failed:", error);
          }
        }, 1000);
      } else {
        const errorData = await response.json();

        // Revert on error
        toast.error(errorData.message || "Failed to update wishlist");
        setWishlistState((prev) => ({
          ...prev,
          [product_id]: isCurrentlyWishlisted,
        }));
        updateWishlistInStorage(product_id, isCurrentlyWishlisted);
      }
    } catch (error) {
      toast.error("Server error");
      // Revert on error
      setWishlistState((prev) => ({
        ...prev,
        [product_id]: isCurrentlyWishlisted,
      }));
      updateWishlistInStorage(product_id, isCurrentlyWishlisted);
    }
  };

  /* ---------------- PRODUCT CARD ---------------- */
  const ProductCard = ({
    product,
    index,
  }: {
    product: ProductType;
    index: number;
  }) => {
    const product_id =
      product.product_id ?? (product._id ? Number(product._id) : null);
    const isWishlisted = product_id ? wishlistState[product_id] : false;

    return (
      <div className="w-full max-w-[332px] h-[450px] mx-auto cursor-pointer">
        <div
          className="relative h-full"
          onClick={() => {
            setSelectedProduct(product);
            router.push(`/product/${product._id}`);
          }}
        >
          {/* Product Image */}
          <div className="relative h-72 overflow-hidden">
            <img
              src={defaultImages[index % defaultImages.length]}
              alt={product.productName}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />

            {/* Wishlist Button - Positioned absolutely */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleWishlist(product);
              }}
              className="absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-6 h-6 transition-all duration-300 ${
                  isWishlisted
                    ? "fill-[#077D40] text-[#077D40]"
                    : "text-gray-600 hover:text-[#077D40]"
                }`}
              />
            </button>
          </div>

          {/* Product Info */}
          <div className="mt-4">
            <p className="font-bold text-lg line-clamp-1">
              {product.productName}
            </p>
            <p className="text-gray-600 mt-2 text-lg font-semibold">
              ₹{product.regularPrice ?? 95}
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="absolute bottom-0 left-0 right-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAdd(product);
              }}
              className={`w-full h-[45px] border transition-all duration-300 font-medium ${
                addedProductId === product_id
                  ? "bg-[#077D40] text-white scale-95"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-[#077D40] hover:text-white hover:border-[#077D40]"
              }`}
            >
              {addedProductId === product_id ? "Added ✓" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* -------------------- CATEGORY CLICK -------------------- */
  const handleCategoryClick = (categoryId?: number) => {
    setActiveCategory(categoryId ?? "all");
    fetchProducts(categoryId);
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderThree />

      <div className="max-w-[1430px] mt-[150px] mx-auto px-4">
        {/* CATEGORY BAR - RESPONSIVE */}
        <div className="mb-10">
          {/* Mobile Dropdown (sm and below) */}
          <div className="block sm:hidden">
            <div className="relative">
              <div className="bg-[#F5F5F5] rounded-full">
                <Menu as="div" className="relative w-full inline-block">
                  <MenuButton className="inline-flex text-black w-full justify-between rounded-md bg-white/10 px-3 py-2 text-[18px] font-semibold inset-ring-1 inset-ring-white/5 hover:bg-white/20">
                    {activeCategory === "all" ? "All Products" : categories.find(c => c.category_id === activeCategory)?.categoryName || "All Products"}
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-999 mt-2 w-full text-center rounded-md bg-white/90 shadow-xl outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                    <div className="py-1">
                      <MenuItem>
                        <button
                          onClick={() => handleCategoryClick()}
                          className="block w-full text-center px-4 py-2 text-[18px] font-semibold text-black data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden hover:bg-white/5">
                          All Products
                        </button>
                      </MenuItem>
                      
                      {categories.map((cat) => (
                        <MenuItem key={cat.category_id}>
                          <button
                            onClick={() => handleCategoryClick(cat.category_id)}
                            className="block w-full text-center px-4 py-2 text-[18px] font-semibold text-black data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden hover:bg-white/5"
                          >
                            {cat.categoryName}
                          </button>
                        </MenuItem>
                      ))}
                    </div>
                  </MenuItems>
                </Menu>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Horizontal Scroll (sm and above) */}
          <div className="hidden sm:block">
            <div className="bg-[#F5F5F5] p-5 rounded-full flex lg:gap-3 flex-wrap">
              <button
                onClick={() => handleCategoryClick()}
                className={`px-5 py-2 rounded-full transition-colors duration-200 ${
                  activeCategory === "all"
                    ? "bg-[#A3C526] text-white shadow-sm"
                    : "text-gray-700"
                }`}
              >
                All Products
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.category_id}
                  onClick={() => handleCategoryClick(cat.category_id)}
                  className={`px-5 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === cat.category_id
                      ? "bg-[#A3C526] text-white shadow-sm"
                      : "text-gray-700"
                  }`}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LogoLineLoader />
            </div>
          ) : error ? (
            <p className="text-center text-gray-500 text-lg py-20">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-20">
              No products found
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <ProductCard
                  key={product._id || `product-${index}`}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-20">
        <FooterTwo />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="light"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

// Add custom styles for better dropdown appearance
const styles = `
  /* Custom select styling */
  select {
    cursor: pointer;
    background-image: none !important;
  }
  
  select option {
    padding: 12px;
    background-color: white;
    color: #333;
  }
  
  select option:hover,
  select option:focus {
    background-color: #f0f0f0;
  }
  
  /* Remove default dropdown arrow for consistency */
  select::-ms-expand {
    display: none;
  }
  
  /* Scrollbar hiding for desktop */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* Custom dropdown focus styles */
  select:focus {
    outline: 2px solid #A3C526;
    outline-offset: 2px;
  }`;

// Add styles to head
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
