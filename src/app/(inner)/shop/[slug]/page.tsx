"use client";

import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import HeaderOne from "@/components/header/HeaderOne";
import ShortService from "@/components/service/ShortService";
import RelatedProduct from "@/components/product/RelatedProduct";
import FooterOne from "@/components/footer/FooterOne";
import { useParams } from "next/navigation";
import { Minus, Plus } from "lucide-react";

import { useCart } from "@/components/header/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductImage {
  image_id: number;
  image_url: string;
}

interface ProductType {
  product_id: number;
  category_id?: number;
  productName: string;
  regularPrice?: number | null;
  salePrice?: number | null;
  description?: string;
  has_variants?: boolean | number;
  productImages?: ProductImage[];
  [key: string]: any;
}

// RatingProgressBar component
const RatingProgressBar = ({
  rating,
  percentage,
}: {
  rating: number;
  percentage: number;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-600 w-8">{rating}★</span>
    <div className="flex-1 bg-gray-200 rounded-full h-2">
      <div
        className="bg-yellow-400 h-2 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
    <span className="text-sm text-gray-500 w-12">{percentage}%</span>
  </div>
);

const CompareElements: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("tab1");
  const [activeImage, setActiveImage] = useState<string>("");

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://ekomart-backend.onrender.com/api/product/getproductbyid/7
          `
        );
        const data = await res.json();
        setProduct(data);

        // Safely set active image
        if (data?.productImages && data.productImages.length > 0) {
          setActiveImage(data.productImages[0].image_url);
        } else {
          setActiveImage("/assets/images/placeholder.png"); // fallback
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleAdd = () => {
    if (!product) return;

    addToCart({
      id: Date.now(),
      image: product.productImages?.[0]?.image_url ?? "",
      title: product.productName ?? "Default Product Title",
      price: product.salePrice ?? product.regularPrice ?? 0,
      quantity: quantity,
      active: true,
      regularPrice: undefined,
      productImage: "",
      productName: ""
    });

    setAdded(true);
    toast.success("🎉 Successfully Added To Cart!");
    setTimeout(() => setAdded(false), 3000);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading Product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-regular fa-triangle-exclamation text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been moved.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <i className="fa-regular fa-arrow-left"></i>
            Return to Shop
          </a>
        </div>
      </div>
    );
  }

  const thumbnails =
    product.productImages && product.productImages.length > 0
      ? product.productImages
      : [
          { image_id: 1, image_url: "/assets/images/shop/01.jpg" },
          { image_id: 2, image_url: "/assets/images/shop/02.jpg" },
          { image_id: 3, image_url: "/assets/images/shop/03.jpg" },
          { image_id: 4, image_url: "/assets/images/shop/04.jpg" },
        ];

  function setSelectedWeight(value: Key | null | undefined): void {
    throw new Error("Function not implemented.");
  }

  function setActiveFilter(filter: string): void {
    throw new Error("Function not implemented.");
  }

  const reviewsData = [
    {
      id: 1,
      username: "Ile Marthy",
      rating: 5,
      title: "Excellent Quality!",
      comment:
        "Great products, very fresh and organic. Will definitely buy again!",
      date: "1/06/2025",
      verified: true,
      helpful: 12,
      avatar: "M",
    },
    {
      id: 2,
      username: "Chintan Rabadiya",
      rating: 5,
      title: "Best for Health",
      comment:
        "This is best for health and easy to use. Perfect for daily breakfast!",
      date: "24/06/2025",
      verified: true,
      helpful: 8,
      avatar: "C",
    },
    {
      id: 3,
      username: "Sarah Johnson",
      rating: 4,
      title: "Good Value",
      comment:
        "Quality is good and packaging was excellent. Would recommend to others.",
      date: "15/06/2025",
      verified: false,
      helpful: 5,
      avatar: "S",
    },
  ];

  const filteredReviews = reviewsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/30">
      <HeaderOne />
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 py-4 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex w-full gap-3 items-center text-[16px]">
            <a
              href="/"
              className="text-gray-500 text-[20px] hover:text-green-600 transition-colors duration-200 flex items-center gap-1"
            >
              Home
            </a>
            <i className="fa-regular fa-chevron-right text-md text-gray-400" />
            <a
              href="/shop"
              className="text-gray-500 hover:text-green-600 transition-colors duration-200"
            >
              Shop
            </a>
            <i className="fa-regular fa-chevron-right text-md text-gray-400" />
            <span className="text-green-600 font-semibold truncate max-w-[200px]">
              {product.productName ?? "Product"}
            </span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Main Product */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100/60 overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl">
              <div className="p-6 md:p-8 flex gap-50 flex-col lg:flex-row">
                {/* Images */}
                <div className="space-y-6 max-w-[700px]">
                  <div className="relative max-w-[700px] h-auto mx-auto bg-white rounded-2xl overflow-hidden aspect-square border shadow-md border-gray-200">
                    <img
                      src={
                        product.productImages?.[0]?.image_url ??
                        "/assets/images/placeholder.png"
                      }
                      alt={product.productName ?? "Product"}
                      className="w-auto h-auto mx-auto mt-10 object-contain p-6 transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-4 gap-4">
                    {thumbnails.map((thumb) => (
                      <div
                        key={thumb.image_id}
                        className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-all duration-300 group ${
                          activeImage === thumb.image_url
                            ? "border-green-500 ring-3 ring-green-200 shadow-md scale-105"
                            : "border-gray-200/60 hover:border-green-300 hover:shadow-md"
                        }`}
                        onClick={() => setActiveImage(thumb.image_url)}
                      >
                        <div className="aspect-square bg-gray-50">
                          <img
                            src={thumb.image_url}
                            alt="product-thumb"
                            className="w-full h-full bg-white object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Category and Rating */}
                  <div className="flex items-center justify-between">
                    <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-[14px] font-medium">
                      🍃 Organic Food
                    </span>
                    <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-full">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fas fa-star text-sm" />
                        ))}
                      </div>
                      <span className="text-orange-700 text-[12px] font-medium">
                        4.9 (128 Reviews)
                      </span>
                    </div>
                  </div>
                  {/* Title */}
                  <div>
                    <h3 className="text-[24px] font-bold text-gray-900 leading-tight mb-2">
                      {product.productName ?? "Product Name"}
                    </h3>
                    <p className="text-green-600 font-semibold flex items-center gap-2">
                      <i className="fa-regular fa-badge-check"></i>
                      Premium Quality • 100% Natural
                    </p>
                  </div>
                  {/* Description */}
                  <p className="text-gray-600 w-full leading-relaxed text-lg border-l-4 border-green-500 pl-4 bg-green-50/50 py-2 rounded-r-lg">
                    {product.description ||
                      "Delicious and nutritious organic oats."}
                  </p>
                  <div className="max-w-[400px]">
                    {/* Price Section */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl max-w-[400px] p-6 border border-green-200/40">
                      <div className="flex items-end justify-between mb-3">
                        <div className="flex items-baseline gap-3">
                          <span className="text-4xl font-bold text-green-700">
                            Rs. {product.salePrice ?? "0.00"}
                          </span>
                          <span className="text-2xl text-gray-400 line-through">
                            Rs. {product.regularPrice ?? "0.00"}
                          </span>
                        </div>
                        <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          Save Rs. {product.regularPrice! - product.salePrice!}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <i className="fa-regular fa-bolt"></i>
                        <span className="font-medium">Best value offer</span>
                      </div>
                    </div>

                    {/* Weight Selection */}
                    <div className="flex items-center mt-10 gap-5">
                      <div className="h-10">
                        <h5 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          Weight:
                          {product.weight === "500g" ? "320.00" : "400.00"}
                        </h5>
                      </div>
                      <div className="grid w-auto grid-cols-2 gap-4">
                        {product.weightOptions.map(
                          (option: {
                            value: Key | null | undefined;
                            label:
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | ReactPortal
                              | Promise<
                                  | string
                                  | number
                                  | bigint
                                  | boolean
                                  | ReactPortal
                                  | ReactElement<
                                      unknown,
                                      string | JSXElementConstructor<any>
                                    >
                                  | Iterable<ReactNode>
                                  | null
                                  | undefined
                                >
                              | null
                              | undefined;
                          }) => (
                            <div className="">
                              <button
                                key={option.value}
                                className={`p-2 rounded-xl font-semibold ${
                                  product.weight === option.value
                                    ? "ring-2 ring-green-500"
                                    : "ring-2 ring-gray-300"
                                }`}
                                onClick={() => setSelectedWeight(option.value)}
                              >
                                <div className="text-center w-auto">
                                  <div className="font-bold">
                                    {option.label}
                                  </div>
                                </div>
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <div className="space-y-6">
                      <div className="flex gap-4 mt-5">
                        <span className="text-black font-bold text-md">
                          Availability:
                        </span>
                        <span className="text-green-400">In stock!</span>
                      </div>
                      <div className="flex items-center gap-10 rounded-2xl mt-10">
                        <span className="text-[16px] font-semibold text-gray-900">
                          Quantity:
                        </span>
                        <div className="flex items-center border h-15 w-35 border-gray-300 bg-white shadow-sm">
                          <button
                            className="text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-all duration-200 rounded-l-xl"
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                          >
                            <i className="text-green-700 font-bold">
                              <Minus size={16} className="ml-1" />
                            </i>
                          </button>
                          <span className="font-bold min-w-12 text-center border-x border-gray-300 bg-white">
                            {quantity}
                          </span>
                          <button
                            className="text-gray-600 hover:bg-gray-100 transition-all duration-200 rounded-r-xl"
                            onClick={increaseQuantity}
                          >
                            <i className="text-green-700 font-bold">
                              <Plus size={16} className="ml-1" />
                            </i>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-4">
                        <div className="border-2 rounded-full">
                          <button
                            className="group flex items-center justify-center group-hover:scale-110 gap-3 text-black py-4 px-6 font-bold text-lg"
                            onClick={handleAdd}
                          >
                            <i
                              className={`fa-regular ${
                                added ? "fa-check" : "fa-cart-shopping"
                              } group-hover:scale-110 transition-transform`}
                            />
                            <span>
                              {added ? "Added to Cart" : "Add to Cart"}
                            </span>
                          </button>
                        </div>
                        <div className="border-2 rounded-full">
                          <button className="group flex items-center justify-center gap-3 text-black py-4 px-6 font-bold text-lg">
                            <span>Buy it now</span>
                            <i className="fa-regular fa-arrow-right group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* Payment Methods */}
                    <div className="">
                      <div className="">
                        <div className="">
                          <img
                            src="/assets/images/shop/payment-btn.jpg"
                            alt="Payment Methods"
                            className="w-[500px] max-w-[100%] h-auto rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Simple Product Tabs */}
                  <div className="">
                    <div className="w-full h-full">
                      <nav className="flex text-[20px] text-black">
                        <div className="flex">
                          {[
                            {
                              id: "tab1",
                              label: "📋 Product Details",
                            },
                            {
                              id: "tab2",
                              label: "📊 Specifications",
                            },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() =>
                                setActiveTab((prev) =>
                                  prev === tab.id ? "" : tab.id
                                )
                              } // toggle logic
                              className={`py-5 px-1 border-b-2 font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                                activeTab === tab.id
                                  ? "border-green-500 text-green-600"
                                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      </nav>
                    </div>
                  </div>
                  <div>
                    {activeTab === "tab1" && (
                      <div className="space-y-8">
                        <div className="prose prose-lg max-w-none">
                          <p className="text-gray-700 leading-relaxed text-lg">
                            Eco-Mart Organic Oats are carefully sourced from
                            certified organic farms that practice sustainable
                            agriculture...
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                            <div className="space-y-6">
                              <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <i className="fa-regular fa-seedling text-green-500"></i>
                                Key Benefits
                              </h4>
                              <ul className="space-y-4">
                                {[
                                  "Rich in dietary fiber for digestive health",
                                  "Packed with essential vitamins and minerals",
                                  "Supports heart health and cholesterol management",
                                  "Provides sustained energy release",
                                  "100% natural with no artificial additives",
                                ].map((benefit, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-3 text-gray-700"
                                  >
                                    <i className="fa-regular fa-check text-green-500 mt-1 text-sm"></i>
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/40">
                              <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="fa-regular fa-clock text-green-500"></i>
                                Preparation Tips
                              </h5>
                              <div className="space-y-3 text-sm text-gray-700">
                                <p>• Cook with milk or water for 5-7 minutes</p>
                                <p>• Add fruits and nuts for extra nutrition</p>
                                <p>• Perfect for overnight oats preparation</p>
                                <p>• Can be used in baking and smoothies</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === "tab2" && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <h4 className="text-2xl font-bold text-gray-900">
                              Nutritional Information
                            </h4>
                            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                              {[
                                { label: "Energy", value: "389 kcal" },
                                { label: "Protein", value: "16.9 g" },
                                { label: "Carbohydrates", value: "66.3 g" },
                                { label: "Dietary Fiber", value: "10.6 g" },
                                { label: "Fat", value: "6.9 g" },
                                { label: "Sugar", value: "0 g" },
                              ].map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                                >
                                  <span className="font-medium text-gray-700">
                                    {item.label}
                                  </span>
                                  <span className="font-semibold text-gray-900">
                                    {item.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-6">
                            <h4 className="text-2xl font-bold text-gray-900">
                              Product Specifications
                            </h4>
                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                              <table className="w-full">
                                <tbody className="divide-y divide-gray-200">
                                  {[
                                    { spec: "Brand", value: "Eco-Mart" },
                                    {
                                      spec: "Product Type",
                                      value: "Rolled Oats",
                                    },
                                    {
                                      spec: "Organic Certification",
                                      value: "USDA Certified",
                                    },
                                    {
                                      spec: "Shelf Life",
                                      value: "18 Months",
                                    },
                                    {
                                      spec: "Storage",
                                      value: "Cool Dry Place",
                                    },
                                    {
                                      spec: "Country of Origin",
                                      value: "India",
                                    },
                                  ].map((row, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      <td className="px-6 py-4 font-medium text-gray-700 border-r border-gray-200">
                                        {row.spec}
                                      </td>
                                      <td className="px-6 py-4 text-gray-900">
                                        {row.value}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Customer Reviews Section */}
          <div className="lg:col-span-8 mt-12">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100/60 overflow-hidden">
              <div className="border-b border-gray-200/60 bg-gradient-to-r from-green-50 to-emerald-50 p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Customer Reviews
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Read what our customers are saying about this product
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">5.0</div>
                    {/* <StarRating rating={5} /> */}
                  </div>
                  <div className="h-12 w-px bg-gray-300"></div>
                  <div className="text-sm text-gray-500">
                    <div className="font-semibold">Based on</div>
                    <div className="text-gray-900 font-bold">
                      {reviewsData.length} Reviews
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column - Filters */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">
                      Rating Breakdown
                    </h4>
                    <div className="">
                      <RatingProgressBar rating={5} percentage={92} />
                      <RatingProgressBar rating={4} percentage={6} />
                      <RatingProgressBar rating={3} percentage={2} />
                      <RatingProgressBar rating={2} percentage={0} />
                      <RatingProgressBar rating={1} percentage={0} />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">
                      Filter Reviews
                    </h4>
                    {/* {["All Reviews", "5 Stars", "4 Stars", "3 Stars"].map((filter) => (
                       <button
                         key={filter}
                         onClick={() => setActiveFilter(filter)}
                         className={`w-full flex justify-between items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                           setActiveFilter === filter ? "bg-green-50 text-green-700 border border-green-200" : "text-gray-600 hover:bg-gray-50"
                         }`}
                       >
                         <span className="font-medium">{filter}</span>
                       </button>
                     ))} */}
                  </div>
                </div>

                {/* Right Column - Reviews */}
                <div className="lg:col-span-3 space-y-6">
                  {filteredReviews.map(
                    (review: {
                      id: Key | null | undefined;
                      avatar:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      username:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      verified: any;
                      rating: any;
                      date:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      title:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      comment:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      helpful:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    }) => (
                      <div
                        key={review.id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {review.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900 text-lg">
                                  {review.username}
                                </h4>
                                {review.verified && (
                                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                    <i className="fa-regular fa-badge-check text-xs"></i>
                                    Verified
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                {/* <StarRating rating={review.rating} /> */}
                                <span>•</span>
                                <span>{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
                            <i className="fa-regular fa-ellipsis-vertical"></i>
                          </button>
                        </div>
                        <h5 className="font-semibold text-gray-800 text-lg mb-3">
                          {review.title}
                        </h5>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {review.comment}
                        </p>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors">
                              <i className="fa-regular fa-thumbs-up"></i>
                              <span className="text-sm font-medium">
                                Helpful ({review.helpful})
                              </span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors">
                              <i className="fa-regular fa-flag"></i>
                              <span className="text-sm font-medium">
                                Report
                              </span>
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <i className="fa-regular fa-check-circle text-green-500"></i>
                            <span>Purchased from Priyoshop</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}{" "}
                  <div className="text-center mt-8">
                    <button className="bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:border-green-500 hover:text-green-600 transition-all duration-200 transform hover:scale-105">
                      Load More Reviews
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <RelatedProduct />
      <ShortService />
      <FooterOne />{" "}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-50"
      />
    </div>
  );
};
export default CompareElements;
