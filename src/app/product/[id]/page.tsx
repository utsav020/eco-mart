"use client";

import React, { useState, useEffect } from "react";
import ShortService from "@/components/service/ShortService";
import FooterTwo from "@/components/footer/FooterTwo";
import { Heart, Minus, Plus } from "lucide-react";
// import { useCart } from "@/components/header/CartContext";
import { ToastContainer, toast } from "react-toastify";
import { useProduct } from "../../../components/context/page";
import { useRouter, useParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import HeaderThree from "@/components/header/HeaderThree";
import { img } from "framer-motion/client";

interface ProductImage {
  image_id: number;
  image_url: string;
}

interface WeightOption {
  value: string;
  label: string;
  price: number;
}

interface variantImages {
  image_id: number;
  image_url: string;
}

interface ProductVariant {
  product_variant_id: number;
  weight?: string;
  productVariantName?: string;
  salePrice: number;
  regularPrice?: number;
  quantity?: number;
  variantImages?: variantImages[];
  stock?: number;
}

interface WishlistResponse {
  iswishlist: boolean;
}

interface ProductType {
  _id?: string;
  product_id?: number;
  category_id?: number;
  productName: string;
  regularPrice?: number | null;
  salePrice?: number | null;
  has_variants?: boolean | number;
  productImages?: ProductImage[];
  image?: string;
  stock?: number;
  variants?: ProductVariant[]; // ✅ ADD THIS
  [key: string]: any;
}

const CompareElements: React.FC = () => {
  const { selectedProduct } = useProduct();
  const router = useRouter();
  const params = useParams();
  const id = (params as { id?: string })?.id;
  // const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  // const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("tab1");
  const [loading, setLoading] = useState<boolean>(true);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const [wishlistState, setWishlistState] = useState<Record<number, boolean>>(
    {}
  );

  const redirectIfNotLoggedIn = () => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");

    if (!token || !user_id) {
      router.push("/login");
      return true;
    }
    return false;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let loadedProduct: ProductType | null = null;

        if (selectedProduct) {
          loadedProduct = selectedProduct;
          localStorage.setItem(
            "selectedProduct",
            JSON.stringify(selectedProduct)
          );
        } else {
          const savedProduct = localStorage.getItem("selectedProduct");
          if (savedProduct) {
            loadedProduct = JSON.parse(savedProduct);
          } else if (id) {
            const res = await fetch(
              `https://ekomart-backend.onrender.com/api/product/getproductbyid/${id}`
            );
            const data = await res.json();
            loadedProduct = data;
            localStorage.setItem("selectedProduct", JSON.stringify(data));
          }
        }

        if (loadedProduct) {
          setProduct(loadedProduct);
          setActiveImage(
            loadedProduct.productImages?.[0]?.image_url ||
              loadedProduct.image ||
              "/assets/images/placeholder.png"
          );
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [selectedProduct, id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category_id) return;
      try {
        const res = await fetch(
          `https://ekomart-backend.onrender.com/api/product/getproductbycategory/${product.category_id}`
        );
        const data = await res.json();
        const filtered = data.filter(
          (item: ProductType) => item._id !== product._id
        );
        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    if (product?.category_id) {
      fetchRelated();
    }
  }, [product?.category_id]);

  useEffect(() => {
    if (product) {
      const withWeights = {
        ...product,
        weightOptions: [
          { value: "500g", label: "500g", price: product.salePrice ?? 100 },
          {
            value: "1kg",
            label: "1kg",
            price: (product.salePrice ?? 100) * 1.8,
          },
        ],
        stock: product.stock ?? 10,
      };
      setProduct(withWeights);
      setSelectedWeight(withWeights.weightOptions[0].value);
      setDisplayPrice(withWeights.weightOptions[0].price);
    }
  }, [product?.product_id]);

  // ⭐ Add To Cart (FINAL FIXED)
  const handleAdd = async (product: ProductType, index: number) => {
    if (redirectIfNotLoggedIn()) return;

    const user_id = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("token") || "";

    const productId =
      product.product_id ?? (product._id ? Number(product._id) : null);

    if (!productId) return;

    const payload = {
      user_id,
      items: [
        {
          product_id: productId,
          product_variant_id: product.product_variant_id || null,
          quantity,
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
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

  /* ================= WISHLIST HELPERS ================= */

  const getWishlistFromStorage = () => {
    const stored = localStorage.getItem("variant_wishlist");
    return stored ? JSON.parse(stored) : {};
  };

  const saveWishlistToStorage = (data: Record<number, boolean>) => {
    localStorage.setItem("variant_wishlist", JSON.stringify(data));
  };

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

  useEffect(() => {
    setWishlistState(getWishlistFromStorage());
  }, []);

  /* ================= WISHLIST TOGGLE (FIXED) ================= */

  const handleWishlist = async (
    product: ProductType,
    variant: ProductVariant
  ) => {
    if (redirectIfNotLoggedIn()) return;

    const user_id = Number(localStorage.getItem("user_id"));
    const token = localStorage.getItem("token") || "";

    const product_id = product.product_id;
    const variant_id = variant.product_variant_id;

    if (!product_id || !variant_id) return;

    const isWishlisted = wishlistState[variant_id] || false;

    const endpoint = isWishlisted
      ? "https://ekomart-backend.onrender.com/api/user/wishlist/remove"
      : "https://ekomart-backend.onrender.com/api/user/wishlist/add";

    // Optimistic UI
    const updatedState = {
      ...wishlistState,
      [variant_id]: !isWishlisted,
    };
    setWishlistState(updatedState);
    saveWishlistToStorage(updatedState);

    try {
      const res = await fetch(endpoint, {
        method: isWishlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id,
          product_id,
          variant_id,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch {
      // revert
      const reverted = {
        ...wishlistState,
        [variant_id]: isWishlisted,
      };
      setWishlistState(reverted);
      saveWishlistToStorage(reverted);
      toast.error("Wishlist update failed");
    }
  };

  const thumbnails =
    product?.productImages && product.productImages.length > 0
      ? product.productImages
      : [
          { image_id: 1, image_url: "/assets/images/shop/01.jpg" },
          { image_id: 2, image_url: "/assets/images/shop/02.jpg" },
          { image_id: 3, image_url: "/assets/images/shop/03.jpg" },
          { image_id: 4, image_url: "/assets/images/shop/04.jpg" },
        ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading Product...</div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#077D40] text-white rounded-full"
        >
          Back to Shop
        </button>
      </div>
    );

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="min-h-screen">
      <HeaderThree />

      {/* Breadcrumb */}
      <div className="bg-white py-3 sticky top-0 z-40">
        <div className="max-w-[1430px] mx-auto">
          <div className="flex items-center gap-3 text-sm md:text-[20px]">
            <a href="/" className="text-gray-500 hover:text-green-600">
              Home
            </a>
            <span className="text-gray-300">/</span>
            <a href="/shop" className="text-gray-500 hover:text-green-600">
              Shop
            </a>
            <span className="text-gray-300">/</span>
            <span className="text-green-600 font-semibold truncate">
              {product.productName}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-[1430px] mx-auto py-8 px-4 xl:px-4 2xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto xl:flex xl:gap-0 gap-10">
          {/* Left Section */}
          <div className="max-w-[500px] mx-auto 2xl:mx-0 w-full">
            <div className="max-w-[500px] w-full">
              <img
                src={activeImage}
                alt={product.productName}
                className="w-[500px] h-[500px] object-cover rounded-lg"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 max-w-[500px] mx-auto mt-4">
              {thumbnails.map((thumb) => (
                <div className="max-w-[500px] mx-auto">
                  <img
                    key={thumb.image_id}
                    onClick={() => setActiveImage(thumb.image_url)}
                    src={thumb.image_url}
                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer border ${
                      activeImage === thumb.image_url
                        ? "border-[#077D40] border-2 p-1"
                        : "border-[#077D40] border-2"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6 xl:w-[829px] xl:ml-[61px]">
            <h1 className="text-3xl font-bold text-gray-900">
              {product.productName}
            </h1>
            <div className="">
              <p className="text-gray-600">{product.description}</p>
            </div>
            {/* ✅ Dynamic Price Display */}
            <div className="flex items-baseline gap-3 mb-0">
              <span className="text-[30px] font-bold text-[#077D40]">
                Rs.{" "}
                {selectedWeight === "1kg"
                  ? ((product.salePrice ?? 0) * 2).toString()
                  : (product.salePrice ?? "0.00").toString()}
              </span>

              {product.regularPrice && (
                <span className="text-[20px] text-gray-400 line-through">
                  Rs.{" "}
                  {selectedWeight === "1kg"
                    ? ((product.regularPrice ?? 0) * 2).toString()
                    : (product.regularPrice ?? "0.00").toString()}
                </span>
              )}
            </div>

            <div className="h-[182px] w-60">
              {/* Weight Selector (FIXED) */}
              <div className="flex gap-4 items-end">
                <div className="h-[54px] flex items-end">
                  <p className="text-gray-900 font-medium mb-1">Weight:</p>
                </div>

                <div className="flex text-[13px] w-[169px] border rounded-lg border-[#D9D9D9] h-[34px] overflow-hidden">
                  {["1kg", "500g"].map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={`flex-1 font-semibold transition-all duration-300
                      ${
                        selectedWeight === weight
                          ? "bg-[#077D40] text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mt-4 h-10 flex gap-3 items-end">
                <div className="">
                  <p className="text-[16px">Availability: </p>
                </div>
                <div className="">
                  <p className="font-semibold text-[#077D40]">
                    {product.stock && product.stock > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </p>
                </div>
              </div>

              {/* Quantity & Buttons */}
              <div className="mt-6  flex flex-col sm:flex-row xl:flex-col sm:gap-6 gap-3">
                <div className="flex h-11 items-end gap-4">
                  <div className="">
                    <p>Quantity:</p>
                  </div>

                  <div className="flex items-center w-[101px] gap-3 bg-[#F3F3F3] rounded-lg">
                    <div className="bg-[#C3C3C1] rounded-md w-[35px] h-[30px]">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="p-2 rounded-md disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                    </div>

                    <div className="min-w-3 text-center font-bold">
                      {quantity}
                    </div>

                    <div className="bg-[#C3C3C1] rounded-md w-[35px] h-[30px]">
                      <button
                        onClick={increaseQuantity}
                        className="p-2 rounded-md"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="md:flex lg:block xl:flex w-full gap-4">
              <div className="md:w-[332px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(product, 0);
                  }}
                  className={`mt-5 w-full h-[45px] border rounded ${
                    addedProductId === product.product_id
                      ? "bg-[#077D40] text-white"
                      : "hover:bg-[#077D40] hover:text-white"
                  }`}
                >
                  {addedProductId === product.product_id
                    ? "Added ✓"
                    : "Add to Cart"}
                </button>
              </div>

              <div className="md:w-[332px] mt-4 lg:mt-0 xl:mt-0 md:mt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(product, 0);
                    router.push("/cart-summary");
                  }}
                  className={`mt-5 w-full cursor-pointer h-[45px] border rounded ${
                    addedProductId === product.product_id
                      ? "bg-[#077D40] text-white"
                      : "bg-[#077D40] text-white"
                  }`}
                >
                  {addedProductId === product.product_id
                    ? "Buy Now ✓"
                    : "Buy Now"}
                </button>
              </div>
            </div>

            {/* Accepted payments */}
            <div className="mt-6 flex items-center justify-between max-w-sm">
              <div className="text-sm text-gray-600">Accepted Payments:</div>
              <div className="flex items-center gap-2">
                <img
                  src="/assets/images/shop/Credit card1.png"
                  className="h-6"
                  alt="card"
                />
                <img
                  src="/assets/images/shop/Credit card3.png"
                  className="h-6"
                  alt="card"
                />
                <img
                  src="/assets/images/shop/Credit card.png"
                  className="h-6"
                  alt="card"
                />
                <img
                  src="/assets/images/shop/Credit card2.png"
                  className="h-6"
                  alt="card"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div>
          <div className="mt-8">
            <div className="flex gap-10 border-b-2 border-[#D2D0D0]">
              {["tab1", "tab2"].map((tab) => (
                <div className="">
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 font-semibold transition border-b-4 ${
                      activeTab === tab
                        ? "text-green-600 border-green-500"
                        : "text-gray-500 border-transparent"
                    }`}
                  >
                    {tab === "tab1" ? "Product Details" : "Specifications"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 text-gray-700">
              {activeTab === "tab1" && (
                <p>
                  <strong>Dadu Fresh</strong> brings you fresh, organic farm
                  products.
                </p>
              )}

              {activeTab === "tab2" && (
                <p className="text-gray-600">
                  High-quality soyabeans, grown naturally without chemicals.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= PRODUCT VARIANTS ================= */}
      {product.has_variants && product.variants && (
        <div className="max-w-[1430px] mx-auto px-4 mt-16">
          <h2 className="text-2xl font-bold mb-6">Available Variants</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {product.variants.map((variant) => (
              <div
                key={variant.product_variant_id}
                className="hover:shadow-md relative max-w-[332px] h-[450px] border-2 transition"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={
                      variant.variantImages?.[0]?.image_url ||
                      "/assets/images/products/Oats.png"
                    }
                    className="w-full h-full object-cover"
                  />

                  <button
                    onClick={() => handleWishlist(product, variant)}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-white"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        wishlistState[variant.product_variant_id]
                          ? "fill-[#077D40] text-[#077D40]"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold">
                    {variant.productVariantName}
                  </h3>
                  <p>{variant.weight}</p>
                  <p className="font-semibold">Rs. {variant.salePrice}</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                  <button
                    disabled={variant.quantity === 0}
                    onClick={() =>
                      handleAdd(
                        {
                          ...product,
                          product_variant_id: variant.product_variant_id,
                        },
                        0
                      )
                    }
                    className={`w-full h-[45px] border transition-all duration-300 font-medium
                      ${
                        variant.quantity === 0
                          ? "bg-[#077D40] text-white scale-95"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-[#077D40] hover:text-white hover:border-[#077D40]"
                      }`}
                  >
                    {addedProductId === variant.product_variant_id
                      ? "Added ✓"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-[100px]">
        <FooterTwo />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CompareElements;
