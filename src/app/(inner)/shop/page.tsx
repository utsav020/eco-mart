"use client";
import React, { useState, useEffect } from "react";
import HeaderThree from "@/components/header/HeaderThree";
import { Heart } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FooterTwo from "@/components/footer/FooterTwo";
import { usePathname, useRouter } from "next/navigation";
import { useProduct } from "@/components/context/page";
import { ProductImage } from "@/app/dashboard/types/product";
import LogoLineLoader from "@/components/loader/LogoLineLoader";

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

export default function BlogGridMain() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** 🔥 WISHLIST STATE */
  const [wishlistState, setWishlistState] = useState<Record<number, boolean>>(
    {}
  );

  const router = useRouter();
  const pathname = usePathname();
  const { setSelectedProduct } = useProduct();

  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const defaultImages = ["/assets/images/products/Oats.png"];

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
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- WISHLIST CHECK (IMPORTANT) ---------------- */
  /* ---------------- WISHLIST CHECK (FIXED) ---------------- */
  const checkWishlistStatus = async (productList: ProductType[]) => {
    const user_id = Number(localStorage.getItem("user_id"));
    if (!user_id) return;

    const token = localStorage.getItem("token") || "";
    const statusMap: Record<number, boolean> = {};

    await Promise.all(
      productList.map(async (product) => {
        const product_id =
          product.product_id ?? (product._id ? Number(product._id) : null);

        if (!product_id) return;

        try {
          const res = await fetch(
            `https://ekomart-backend.onrender.com/api/user/wishlist-check?user_id=${user_id}&product_id=${product_id}&variant=0`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();

          /**
           * ✅ ONLY TRUE WHEN BACKEND CONFIRMS IT
           * Adjust keys if backend uses different naming
           */
          statusMap[product_id] =
            data?.wishlist === true || data?.status === true;
        } catch {
          statusMap[product_id] = false;
        }
      })
    );

    setWishlistState(statusMap);
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length) {
      checkWishlistStatus(products);
    }
  }, [products]);

  /* ---------------- ADD TO CART ---------------- */
  const handleAdd = async (product: ProductType) => {
    if (redirectIfNotLoggedIn()) return;

    const user_id = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("token") || "";
    const product_id =
      product.product_id ?? (product._id ? Number(product._id) : null);

    try {
      await fetch("https://ekomart-backend.onrender.com/api/cart/addcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id,
          items: [{ product_id, quantity: 1 }],
        }),
      });

      toast.success("Added to cart");
      setAddedProductId(product_id);
      setTimeout(() => setAddedProductId(null), 1200);
    } catch {
      toast.error("Server error");
    }
  };

  /* ---------------- WISHLIST TOGGLE ---------------- */
  const handleWishlist = async (product: ProductType) => {
    if (redirectIfNotLoggedIn()) return;

    const user_id = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("token") || "";
    const product_id =
      product.product_id ?? (product._id ? Number(product._id) : null);

    if (!product_id) return;

    const isWishlisted = wishlistState[product_id];

    try {
      await fetch(
        isWishlisted
          ? "https://ekomart-backend.onrender.com/api/user/wishlist/remove"
          : "https://ekomart-backend.onrender.com/api/user/wishlist/add",
        {
          method: isWishlisted ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id, product_id }),
        }
      );

      setWishlistState((prev) => ({
        ...prev,
        [product_id]: !isWishlisted,
      }));
    } catch {
      toast.error("Wishlist update failed");
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

    return (
      <div
        className="w-[332px] h-[450px] mx-auto cursor-pointer"
        onClick={() => {
          setSelectedProduct(product);
          router.push(`/product/${product._id}`);
        }}
      >
        <div className="relative">
          <img
            src={defaultImages[index % defaultImages.length]}
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
              className={`w-6 h-6 transition ${
                wishlistState[product_id!]
                  ? "fill-[#077D40] text-[#077D40]"
                  : "text-[#333]"
              }`}
            />
          </button>
        </div>

        <p className="pt-3 font-bold">{product.productName}</p>
        <p className="text-gray-600 mt-2">₹{product.regularPrice ?? 95}</p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdd(product);
          }}
          className={`mt-5 w-full h-[45px] border rounded ${
            addedProductId === product_id
              ? "bg-[#077D40] text-white"
              : "hover:bg-[#077D40] hover:text-white"
          }`}
        >
          {addedProductId === product_id ? "Added ✓" : "Add to Cart"}
        </button>
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

      <div className="max-w-[1430px] mt-[150px] mx-auto">
        {/* CATEGORY BAR */}
        <div className="bg-[#F5F5F5] p-5 rounded-full flex gap-3 flex-wrap">
          <button
            onClick={() => handleCategoryClick()}
            className={`px-5 py-2 rounded-full ${
              activeCategory === "all"
                ? "bg-[#A3C526] text-white"
                : "text-gray-700"
            }`}
          >
            All Products
          </button>

          {categories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => handleCategoryClick(cat.category_id)}
              className={`px-5 py-2 rounded-full ${
                activeCategory === cat.category_id
                  ? "bg-[#A3C526] text-white"
                  : "text-gray-700"
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        <div className="mt-10 px-5">
          {loading ? (
            <LogoLineLoader />
          ) : error ? (
            <p className="text-center text-gray-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FooterTwo />
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </div>
  );
}
