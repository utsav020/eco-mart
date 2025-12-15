"use client";
import React, { useState, useEffect } from "react";
import HeaderThree from "@/components/header/HeaderThree";
import { Heart } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FooterTwo from "@/components/footer/FooterTwo";
import { useRouter } from "next/navigation";
import { useProduct } from "@/components/context/page";
import { ProductImage } from "@/app/dashboard/types/product";
import { useCategory } from "@/components/context/CategoryContext";
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

export default function BlogGridMain() {
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { setSelectedProduct } = useProduct();
  const { setSelectedCategory } = useCategory();

  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  const defaultImages = [
    "/Soyabean.png",
    "/Oats.png",
    "/CornSeed.png",
    "/Moong.png",
    "/MultigrainAtta.png",
  ];

  const categoryMap: Record<string, number> = {
    Millets: 1,
    Beans: 2,
    Dals: 3,
    "Grains & Cereals": 4,
  };

  // Fetch products
  const fetchProductsByCategory = async (categoryId?: number) => {
    setLoading(true);
    setError("");

    try {
      const url = categoryId
        ? `https://ekomart-backend.onrender.com/api/product/getproductbycategory/${categoryId}`
        : `https://ekomart-backend.onrender.com/api/product/getallproducts`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.length) {
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
    fetchProductsByCategory();
  }, []);

  const getImage = (product: ProductType, index: number) => {
    if (product.productImages?.length)
      return product.productImages[0].image_url;
    if (product.image?.trim())
      return product.image;
    return defaultImages[index % defaultImages.length];
  };

  // Add to cart
  const handleAdd = async (product: ProductType) => {
    const user_id = Number(localStorage.getItem("user_id"));
    if (!user_id) return toast.error("Please login first.");

    const token = localStorage.getItem("token") || "";
    const productId = product.product_id ?? Number(product._id);

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
      const res = await fetch("https://ekomart-backend.onrender.com/api/cart/addcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Add to cart failed");

      toast.success("Added to cart!");
      setAddedProductId(productId);
      setTimeout(() => setAddedProductId(null), 1200);
    } catch {
      toast.error("Server error");
    }
  };

  // ⭐ INDIVIDUAL PRODUCT CARD COMPONENT
  const ProductCard = ({ product, index }: { product: ProductType; index: number }) => {
    const [isFav, setIsFav] = useState(false);

    const product_id =
      product.product_id ??
      (product._id ? Number(product._id) : null);

      const product_variant_id =
      product.product_variant_id ? Number(product.product_variant_id) : null;

    // ⭐ Check wishlist when this product is rendered
    useEffect(() => {
      const checkWishlist = async () => {
        const user_id = Number(localStorage.getItem("user_id"));
        if (!user_id || !product_id) return;

        try {
          const res = await fetch(
            `https://ekomart-backend.onrender.com/api/user/wishlist-check?user_id=${user_id}&product_id=${product_id}&product_variant_id=${product_variant_id ?? ""}`
          );

          const data = await res.json();
          setIsFav(data.isFavourite === true);
        } catch (err) {
          console.log("wishlist check failed");
        }
      };

      checkWishlist();
    }, [product_id]);

    // Add/Remove wishlist
    const toggleWishlist = async (e: any) => {
      e.stopPropagation();

      const user_id = Number(localStorage.getItem("user_id"));
      const token = localStorage.getItem("token") || "";
      if (!user_id) return toast.error("Login first.");

      try {
        const res = await fetch(
          isFav
            ? "https://ekomart-backend.onrender.com/api/user/wishlist/remove"
            : "https://ekomart-backend.onrender.com/api/user/wishlist/add",
          {
            method: isFav ? "DELETE" : "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({
              user_id,
              product_id,
              product_variant_id : product.product_variant_id || null,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) return toast.error(data.message || "Wishlist update failed");

        setIsFav(!isFav);
        toast.success(!isFav ? "Added to favourites!" : "Removed from favourites!");
      } catch {
        toast.error("Wishlist update failed");
      }
    };

    return (
      <div
        className="w-[332px] h-[450px] mx-auto relative cursor-pointer"
        onClick={() => {
          setSelectedProduct(product);
          router.push(`/product/${product._id}`);
        }}
      >
        <div className="relative flex justify-center items-center">
          <img
            src={getImage(product, index)}
            className="w-[331.75px] h-72 object-cover"
          />

          {/* HEART ICON */}
          <button
            onClick={toggleWishlist}
            className="absolute bottom-2 right-2 p-2"
          >
            <Heart
              className={`w-6 h-6 transition ${
                isFav ? "fill-[#077D40] text-[#077D40]" : "text-[#333]"
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

  return (
    <div className="min-h-screen bg-white">
      <div className="border-2">
        <HeaderThree />
      </div>

      <div className="max-w-[1430px] mt-[180px] px-5 mx-auto">
        {/* PRODUCT GRID */}
        <div className="mt-10">
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
