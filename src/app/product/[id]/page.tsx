"use client";

import React, { useState, useEffect } from "react";
import ShortService from "@/components/service/ShortService";
import RelatedProduct from "@/components/product/RelatedProduct";
import FooterTwo from "@/components/footer/FooterTwo";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/components/header/CartContext";
import { ToastContainer, toast } from "react-toastify";
import { useProduct } from "../../../components/context/page";
import { useRouter, useParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import HeaderThree from "@/components/header/HeaderThree";

interface ProductImage {
  image_id: number;
  image_url: string;
}

interface WeightOption {
  value: string;
  label: string;
  price: number;
}

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
  productWeight?: string;
  weightOptions?: WeightOption[];
  image?: string;
  stock?: number;
  [key: string]: any;
}

const CompareElements: React.FC = () => {
  const { selectedProduct } = useProduct();
  const router = useRouter();
  const params = useParams();
  const id = (params as { id?: string })?.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("tab1");
  const [loading, setLoading] = useState<boolean>(true);

  const tabs = [
    { id: "tab1", label: "Product Details" },
    { id: "tab2", label: "Specifications" },
  ];

  // ✅ Load Product (from context, localStorage, or API)
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

  // ✅ Fetch Related Products based on category_id
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category_id) return;
      try {
        const res = await fetch(
          `https://ekomart-backend.onrender.com/api/product/getproductbycategory/${product.category_id}`
        );
        const data = await res.json();
        // Filter out current product
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

  // ✅ Initialize Weight & Price
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

  const handleAdd = () => {
    if (!product) return;

    addToCart({
      id: product._id ? Number(product._id) : Date.now(),
      image: product.image || activeImage,
      productName: product.productName,
      price: displayPrice || Number(product.regularPrice),
      quantity,
      active: true,
      regularPrice: product.regularPrice,
      productImage: product.image || activeImage || "",
      title: product.productName,
    });

    setAdded(true);
    toast.success("🎉 Successfully Added To Cart!");
    setTimeout(() => setAdded(false), 3000);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading Product...</div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600 mb-4">
          No product data found. Please return to the shop.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#077D40] text-white rounded-full"
        >
          Back to Shop
        </button>
      </div>
    );

  const thumbnails =
    product.productImages && product.productImages.length > 0
      ? product.productImages
      : [
          { image_id: 1, image_url: "/assets/images/shop/01.jpg" },
          { image_id: 2, image_url: "/assets/images/shop/02.jpg" },
          { image_id: 3, image_url: "/assets/images/shop/03.jpg" },
          { image_id: 4, image_url: "/assets/images/shop/04.jpg" },
        ];

  return (
    <div className="min-h-screen">
      <HeaderThree />

      {/* Breadcrumb */}
      <div className="bg-white py-4 sticky top-0 z-40">
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

      {/* Product Details */}
      <div className="max-w-[1730px] border-2 mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white overflow-hidden mb-8">
              <div className="flex gap-20 flex-col lg:flex-row">
                {/* Images */}
                <div className="space-y-6 max-w-[500px]">
                  <div className="max-w-[500px] h-[500px] mx-auto bg-white overflow-hidden aspect-square">
                    <img
                      src={activeImage}
                      alt={product.productName}
                      className="w-[500px] h-[500px] object-cover"
                    />
                  </div>

                  {/* Thumbnails */}
                  <div className="grid max-w-[500px] h-[90px]">
                    {thumbnails.map((thumb) => (
                      <div
                        key={thumb.image_id}
                        className="w-[185px] h-[90px] mx-auto"
                      >
                        <div
                          onClick={() => setActiveImage(thumb.image_url)}
                          className={`cursor-pointer w-[90px] h-[90px] rounded-xl overflow-hidden transition-all duration-300 group ${
                            activeImage === thumb.image_url
                              ? "border-green-500 ring-2 ring-[#077D40] shadow-md scale-105"
                              : "border-gray-200/60 hover:border-green-300 hover:shadow-md"
                          }`}
                        >
                          <img
                            src={thumb.image_url}
                            alt="thumb"
                            className="w-[80px] mt-3 flex items-center justify-center h-[80px] object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <p className="text-[30px] font-bold text-gray-900">
                    {product.productName}
                  </p>
                  <div className="w-[829px]">
                    <p className="text-gray-600 text-[16px]">
                      {product.description}
                    </p>
                  </div>

                  {/* ✅ Dynamic Price Display */}
                  <div className="flex items-baseline gap-3">
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

                  {/* Weight Selector */}
                  <div className="flex flex-col h-[54px] mb-0 md:flex-row items-start md:items-end gap-4">
                    <div className="flex items-center gap-4">
                      <div className="">
                        <p className="text-[16px] text-gray-900">Weight:</p>
                      </div>
                      <div className="flex text-[13px] border rounded-[8px] border-[#D9D9D9] w-[169px] h-[30px]">
                        {["1kg", "500g"].map((weight) => (
                          <button
                            style={{ borderRadius: "8px" }}
                            key={weight}
                            onClick={() => setSelectedWeight(weight)}
                            className={`rounded-xl font-semibold w-1/2 transition-all duration-200 ${
                              selectedWeight === weight
                                ? "text-white bg-[#077D40]"
                                : "text-black"
                            }`}
                          >
                            {weight}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mb-0 flex items-end h-[54px]">
                    <p className="text-[16px] ">
                      Availability:{" "}
                      <span className="font-semibold text-[#077D40]">
                        {product.stock && product.stock > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex h-[54px] items-end gap-10">
                    <div className="flex items-center gap-10">
                      <span className="text-[16px] text-gray-900">
                        Quantity:
                      </span>
                      <div className="flex w-[101px] h-[30px] bg-[#EBEBEBB8] justify-between items-center border border-gray-300 rounded-xl">
                        <div className="w-[35px] flex items-center h-[30px] rounded-[5px] bg-[#C3C3C1]">
                          <button
                            className="pl-3.5"
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                        <span className="text-[16px]  font-bold">
                          {quantity}
                        </span>

                        <div className="w-[35px] flex items-center pl-3.5 h-[30px] rounded-[5px] bg-[#C3C3C1]">
                          <button className="" onClick={increaseQuantity}>
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 mt-[25px]">
                    <div className="hover:text-white w-[332px] h-[51px] text-[14px]">
                      <button
                        onClick={handleAdd}
                        className={`h-[51px] border border-[#00000080] font-bold rounded-full transition-all duration-300 ${
                          added
                            ? "bg-[#077D40] text-white"
                            : "hover:bg-[#077D40] hover:text-white"
                        }`}
                      >
                        {added ? "Added to your Cart ✅" : "Add to your cart"}
                      </button>
                    </div>

                    <div className="w-[332px] h-[51px] bg-[#077D40] text-white font-bold">
                      <button className="h-[51px] border border-[#00000080] font-bold rounded-full transition-all duration-300">
                        Buy It Now
                      </button>
                    </div>
                  </div>

                  {/* Accepted Payments: */}
                  <div className="flex items-end justify-between w-[366px] h-[50px]">
                    <div className="text-[16px] text-[#00000080]">
                      <p>Accepted Payments:</p>
                    </div>

                    <div className="flex items-center justify-between w-[185px] h-[25px]">
                      <img
                        src="/assets/images/shop/Credit card1.png"
                        alt="Accepted Payments"
                      />
                      <img
                        src="/assets/images/shop/Credit card3.png"
                        alt="Accepted Payments"
                      />
                      <img
                        src="/assets/images/shop/Credit card.png"
                        alt="Accepted Payments"
                      />
                      <img
                        src="/assets/images/shop/Credit card2.png"
                        alt="Accepted Payments"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <nav className="flex border-b max-w-[1730px] h-[80px] border-gray-200">
            <div className="flex gap-10 h-[80px] items-center justify-center w-[350px] text-[20px]">
              {tabs.map((tab) => (
                <div className="">
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`font-semibold text-base transition-all duration-300 border-b-4 ${
                      activeTab === tab.id
                        ? "text-green-600 border-green-500"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                </div>
              ))}
            </div>
          </nav>

          <div className="mt-8">
            {activeTab === "tab1" && (
              <p className="text-[#00000080] font-bold text-[16px]">
                At <span className="text-black font-bold">Dadu Fresh</span>, a
                brand by{" "}
                <span className="text-black font-bold">
                  CSC Kalavad Farmer Producer Company Limited
                </span>
                , we proudly bring you{" "}
                <span className="text-black font-bold">Organic Soyabeans</span>{" "}
                – rich in plant-based protein and essential nutrients.
              </p>
            )}
            {activeTab === "tab2" && (
              <p className="text-[#00000080] font-bold text-[16px]">
                Organic Soyabeans are grown naturally without chemicals and are
                perfect for health-conscious families.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Show Related Products Dynamically */}
      {React.createElement(RelatedProduct as any, {
        products: relatedProducts,
        title: "Related Products",
      })}

      <div className="mt-[100px]">
        <FooterTwo />
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CompareElements;
