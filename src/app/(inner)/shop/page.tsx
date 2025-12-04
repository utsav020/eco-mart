"use client";
import React, { useState, useEffect } from "react";
import HeaderThree from "@/components/header/HeaderThree";
import { useWishlist } from "@/components/header/WishlistContext";
import { Heart } from "lucide-react";
import { useCart } from "@/components/header/CartContext";
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
  category_id?: number;
  productName: string;
  regularPrice?: number | null;
  salePrice?: number | null;
  description?: string;
  has_variants?: boolean | number;
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

  const { addToCart } = useCart();
  const router = useRouter();
  const { setSelectedProduct } = useProduct();
  const { setSelectedCategory } = useCategory();
  const { addToWishlist, wishlistItems } = useWishlist();

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

  // ✅ FETCH PRODUCTS
  const fetchProductsByCategory = async (categoryId?: number) => {
    setLoading(true);
    setError("");

    try {
      const url = categoryId
        ? `https://ekomart-backend.onrender.com/api/product/getproductbycategory/${categoryId}`
        : `https://ekomart-backend.onrender.com/api/product/getallproducts`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data || data.length === 0) {
        setError("No products found.");
        setProducts([]);
      } else {
        setProducts(data);
      }
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    category === "All Products"
      ? fetchProductsByCategory()
      : fetchProductsByCategory(categoryMap[category]);
  };

  const getImage = (product: ProductType, index: number) => {
    if (product.productImages?.length)
      return product.productImages[0].image_url;
    if (product.image?.trim()) return product.image;
    return defaultImages[index % defaultImages.length];
  };

  // ✅ ✅ ✅ ADD TO CART (100% BACKEND SYNCED)
  const handleAdd = (product: ProductType, index: number) => {
    const productId =
      product.product_id ?? (product._id ? parseInt(product._id) : Date.now());

    addToCart(
      {
        id: productId, // ✅ Must be numeric
        product_variant_id: product.product_variant_id || null, // ✅ required
        productName: product.productName,
        price: Number(product.regularPrice || 0),
        regularPrice: product.regularPrice,
        productImage: getImage(product, index),
        image: getImage(product, index),
        quantity: 1,
        active: true,
        description: "",
        title: undefined,
      },
      3 // ✅ user_id
    );

    setAddedProductId(productId);
    setTimeout(() => setAddedProductId(null), 2000);
    toast.success("✅ Product added to cart!");
  };

  // ✅ WISHLIST
  const handleWishlist = (product: ProductType, index: number) => {
    const productId =
      product.product_id ?? (product._id ? parseInt(product._id) : Date.now());

    const exists = wishlistItems.some((i) => i.id === productId);

    if (exists) {
      toast.info("❤️ Already in wishlist!");
      return;
    }

    addToWishlist({
      id: productId,
      image: getImage(product, index),
      title: product.productName,
      price: Number(product.regularPrice || 0),
      quantity: 1,
    });

    toast.success("💖 Added to wishlist!");
  };

  const handleProductClick = (product: ProductType) => {
    setSelectedProduct(product);
    router.push(`/product/${product._id}`);
  };

  useEffect(() => {
    setSelectedCategory(activeCategory);
  }, [activeCategory]);

  const categories = [
    "All Products",
    "Millets",
    "Beans",
    "Dals",
    "Grains & Cereals",
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-2">
        <HeaderThree />
      </div>

      <div className="max-w-[1430px] mt-[180px] px-5 mx-auto">
        {/* ✅ CATEGORY BAR */}
        <div className="bg-[#F5F5F5] h-[230px] md:h-20 pt-5 md:pt-0 md:pl-5 rounded-2xl md:rounded-[200px] block md:flex items-center justify-center md:justify-start gap-4">
          {categories.map((category) => (
            <div className="">
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-5 py-2 rounded-full ${
                  activeCategory === category
                    ? "bg-[#8CC63F] text-white"
                    : "text-gray-700"
                }`}
              >
                {category}
              </button>
            </div>
          ))}
        </div>

        {/* ✅ PRODUCT GRID */}
        <div className="mt-10">
          {loading ? (
            <LogoLineLoader />
          ) : error ? (
            <p className="text-center text-gray-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="w-[332px] h-[450px] mx-auto cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={getImage(product, index)}
                    className="w-full h-72 object-cover"
                  />

                  <div className="pt-3">
                    <div className="">
                      <p className="font-bold">
                        {product.productName || "Product"}
                      </p>

                      <p className="text-gray-600 mt-2">
                        ₹{product.regularPrice || 95}
                      </p>
                    </div>

                    <div className="">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(product, index);
                        }}
                        className={`mt-5 w-full h-[45px] border rounded ${
                          addedProductId ===
                          (product.product_id ||
                            (product._id ? parseInt(product._id) : -1))
                            ? "bg-[#077D40] text-white"
                            : "hover:bg-[#077D40] hover:text-white"
                        }`}
                      >
                        {addedProductId ===
                        (product.product_id ||
                          (product._id ? parseInt(product._id) : -1))
                          ? "Added ✅"
                          : "Add to Cart"}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(product, index);
                    }}
                    className="absolute top-4 right-4"
                  >
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
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
