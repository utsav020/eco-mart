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

interface ProductType {
  _id?: string;
  product_id?: number;
  productName: string;
  regularPrice?: number | null;
  productImages?: ProductImage[];
  image?: string;
  product_variant_id?: number | null;
  [key: string]: any;
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

  const router = useRouter();
  const pathname = usePathname();
  const { setSelectedProduct } = useProduct();

  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  const defaultImages = [
    "/assets/images/products/Oats.png",
  ];

  /* -------------------- FETCH CATEGORIES -------------------- */
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://ekomart-backend.onrender.com/api/categories/getallcategory"
      );
      const data = await res.json();
      setCategories(data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  /* -------------------- FETCH PRODUCTS -------------------- */
  const fetchProducts = async (categoryId?: number) => {
    setLoading(true);
    setError("");

    try {
      const url = categoryId
        ? `https://ekomart-backend.onrender.com/api/product/getproductbycategory/${categoryId}`
        : `https://ekomart-backend.onrender.com/api/product/getallproducts`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data?.length) {
        setProducts([]);
        setError("No products found.");
      } else {
        setProducts(data);
      }
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const getImage = (product: ProductType, index: number) => {
    if (product.productImages?.length)
      return product.productImages[0].image_url;
    if (product.image?.trim()) return product.image;
    return defaultImages[index % defaultImages.length];
  };

  /* -------------------- LOGIN CHECK -------------------- */
  const redirectIfNotLoggedIn = () => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!token || !user_id) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  };

  /* -------------------- ADD TO CART -------------------- */
  const handleAdd = async (product: ProductType) => {
    if (redirectIfNotLoggedIn()) return;

    const user_id = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("token") || "";
    const productId = product.product_id ?? Number(product._id);

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

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Add to cart failed");

      toast.success("Added to cart!");
      setAddedProductId(productId);
      setTimeout(() => setAddedProductId(null), 1200);
    } catch {
      toast.error("Server error");
    }
  };

  /* -------------------- PRODUCT CARD -------------------- */
  const ProductCard = ({
    product,
    index,
  }: {
    product: ProductType;
    index: number;
  }) => {
    const [isFav, setIsFav] = useState(false);
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
        <img
          src={getImage(product, index)}
          className="w-full h-72 object-cover"
        />

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
