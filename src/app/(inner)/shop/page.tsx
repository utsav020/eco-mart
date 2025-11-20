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
  const [addedProductId, setAddedProductId] = useState<string | number | null>(
    null
  );

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

  // ✅ Fetch products by category
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
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, []);

  // ✅ Category switch
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === "All Products") {
      fetchProductsByCategory();
    } else {
      fetchProductsByCategory(categoryMap[category]);
    }
  };

  // ✅ Resolve product image
  const getImage = (product: ProductType, index: number) => {
    if (product.productImages?.length) {
      return product.productImages[0].image_url;
    }
    if (product.image && product.image.trim() !== "") {
      return product.image;
    }
    return defaultImages[index % defaultImages.length];
  };

  // ✅ Add to Cart
  const handleAdd = (product: ProductType, index: number) => {
    addToCart({
      id: product._id ? Number(product._id) : Date.now(),
      image: getImage(product, index),
      title: product.productName || "Organic Product",
      price: parseFloat(product.regularPrice?.toString() ?? "0"),
      quantity: 1,
      active: true,
      productName: product.productName ?? "Default Product Title",
      regularPrice: product.regularPrice,
      productImage: product.image || "",
      description: product.discription ?? "No description available",
    });
    setAddedProductId(product._id || index);
    setTimeout(() => setAddedProductId(null), 4000);
    toast.success("✅ Product added to cart!");
  };

  // ✅ Add to Wishlist
  const handleWishlist = (product: ProductType) => {
    const productIdNumber =
      product.product_id ??
      (product._id ? Number(product._id) : undefined) ??
      Date.now();

    const isInWishlist = wishlistItems.some(
      (item) => String(item.id) === String(productIdNumber)
    );
    if (isInWishlist) {
      toast.info("❤️ Already in wishlist!");
      return;
    }
    addToWishlist({
      id: productIdNumber,
      image: getImage(product, 0),
      title: product.productName || "Product",
      price: parseFloat(product.regularPrice?.toString() ?? "0"),
      quantity: 1,
    });
    toast.success("💖 Added to wishlist!");
  };

  // ✅ Navigate to product detail
  const handleProductClick = (product: ProductType) => {
    setSelectedProduct(product);
    router.push(`/product/${product._id}`);
  };

  useEffect(() => {
    setSelectedCategory(activeCategory);
  }, [activeCategory, setSelectedCategory]);

  const categories = [
    "All Products",
    "Millets",
    "Beans",
    "Dals",
    "Grains & Cereals",
  ];

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="border-2">
        <HeaderThree />
      </div>

      <div className="max-w-[1430px] px-5 mx-auto">
        {/* ✅ Filter Bar */}
        <div className="w-full xl:px-0 bg-[#F5F5F5] max-w-[1730px] h-[280px] md:h-20 md:rounded-[200px] mx-auto py-2 px-4 items-center justify-between gap-3 mt-4">
          <div className="md:flex block items-center ml-auto max-w-full w-[203px] mx-auto md:ml-5 md:mt-0 mt-5 gap-4 text-[16px] font-medium text-gray-700 overflow-x-auto">
            {categories.map((category) => (
              <div className="max-w-full mx-auto">
                <button
                  key={category}
                  // style={{ borderRadius: "200px" }}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-1.5 h-9 rounded-full max-w-[200px] w-[200px] mx-auto md:w-full whitespace-nowrap transition-all duration-200 ${
                    activeCategory === category
                      ? "text-white shadow-sm bg-[#8CC63F] rounded-full"
                      : "hover:text-[#8CC63F] text-gray-700 rounded-full"
                  }`}
                >
                  {category}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Product List */}
        <div className="bg-white max-w-[1430px] w-full mt-5 mx-auto">
          {loading ? (
            <div className="">
              <LogoLineLoader />
            </div>
          ) : error ? (
            <p className="text-center text-gray-500 py-10">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product._id || index}
                  className="relative h-[450px] w-[332px] max-w-[1430px] mx-auto transition duration-300 group cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Discount badge */}
                  <div className="absolute top-4 right-4 bg-[#077D40] text-white text-[15px] px-3 py-1 rounded-full z-10">
                    Save 20%
                  </div>

                  {/* Image section */}
                  <div className="relative flex justify-center items-center">
                    <div className="h-72">
                      <img
                        src={
                          getImage(product, index) ||
                          "/assets/images/products/Oats.png"
                        }
                        alt={product.productName}
                        className="w-[331.75px] h-72 object-cover"
                      />
                    </div>

                    {/* Wishlist icon */}
                    <div className="absolute bottom-1 right-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlist(product);
                        }}
                        className={`p-2 rounded-full transition ${wishlistItems.some(
                          (item) => String(item.id) === String(product._id)
                        )}`}
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            wishlistItems.some(
                              (item) => String(item.id) === String(product._id)
                            )
                              ? "fill-[#077D40] text-[#077D40]"
                              : "text-[#333333]"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* ✅ Product Details */}
                  <div className="pb-3 mt-[13px]">
                    <div className="flex items-center justify-between h-6">
                      <div className="">
                        <p className="text-[14px] font-bold text-[#000000] truncate">
                          {product.productName || "Organic Product"}
                        </p>
                      </div>
                      <div className="flex text-[16px]">★★★★★</div>
                    </div>

                    <div className="flex items-center mt-[15px] justify-between">
                      <div className="">
                        <p className="text-gray-600 text-[14px]">
                          {product.regularPrice
                            ? `₹${product.regularPrice}`
                            : "₹95.00"}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-[12px] text-[#3333338C]/55">
                          4.86 (887k Reviews)
                        </p>
                      </div>
                    </div>

                    <div className="mt-[25px] w-[332px] hover:text-white text-[14px] h-[51px]">
                      <button
                        className={`w-full h-[51px] border border-black rounded hover:bg-[#077D40] hover:text-white transition ${
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
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-[100px] mb-0.5">
        <FooterTwo />
      </div>

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
}
