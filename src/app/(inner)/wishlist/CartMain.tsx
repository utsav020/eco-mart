"use client";
import React, { useState, useEffect } from "react";
import { useWishlist } from "@/components/header/WishlistContext";
import { useCart } from "@/components/header/CartContext";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { ProductImage } from "@/app/dashboard/types/product";

interface ProductType {
  _id?: string;
  product_id?: number;
  category_id?: number;
  productName?: string;
  regularPrice?: number | null;
  salePrice?: number | null;
  description?: string;
  has_variants?: boolean | number;
  productImages?: ProductImage[];
  image?: string;
  [key: string]: any;
}

const WishlistMain = () => {
  const { wishlistItems, removeFromWishlist, updateItemQuantity } =
    useWishlist();
  const { addToCart } = useCart();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [addedProductId, setAddedProductId] = useState<string | number | null>(
      null
    );

  useEffect(() => {
    const total = wishlistItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [wishlistItems]);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon === "12345") {
      setDiscount(0.25);
      setCouponMessage("✅ Coupon applied -25% successfully!");
      localStorage.setItem("coupon", coupon);
      localStorage.setItem("discount", "0.25");
    } else {
      setDiscount(0);
      setCouponMessage("❌ Invalid coupon code");
      localStorage.removeItem("coupon");
      localStorage.removeItem("discount");
    }
  };

  const clearWishlist = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("wishlistItems");
    }
    wishlistItems.forEach((item) => removeFromWishlist(item.id));
    setCoupon("");
    setDiscount(0);
    setCouponMessage("");
    toast.info("Wishlist cleared.");
  };

  const handleAdd = (product: ProductType, index: number) => {
    addToCart({
      id: Date.now(),
      image: getImage(product, index),
      title: product.title ?? "Default Product",
      price: parseFloat(product.price ?? "0"),
      quantity: product.quantity ?? 1,
      active: true,
      regularPrice: product.regularPrice ?? "",
      productImage: product.productImage ?? "",
      productName: product.productName ?? "",
    });

    // Remove from wishlist when moved to cart
    removeFromWishlist(product.id);
    toast.success(`${product.title} added to cart!`);
  };

  // ✅ Add to Cart
    // const handleAdd = (product: ProductType, index: number) => {
    //   addToCart({
    //     id: product.id ? Number(product._id) : Date.now(),
    //     image: getImage(product, index),
    //     title: product.productName || "Organic Product",
    //     price: parseFloat(product.regularPrice?.toString() ?? "0"),
    //     quantity: 1,
    //     active: true,
    //     productName: product.productName ?? "Default Product Title",
    //     regularPrice: product.regularPrice,
    //     productImage: product.image || "",
    //   });
    //   setAddedProductId(product.id);
    //   setTimeout(() => setAddedProductId(null), 4000);
    //   toast.success("✅ Product added to cart!");
    // };

  const finalTotal = subtotal - subtotal * discount;

  return (
    <div className="min-h-screen">
      <div className="max-w-[1430px] mx-auto px-0 sm:px-6 lg:px-0">
        {/* Empty Message */}
        {wishlistItems.length === 0 ? (
          <div className="p-10 bg-white text-center text-gray-500 text-lg rounded-lg shadow">
            Your wishlist is empty. Add products to see them here.
          </div>
        ) : (
          <>
            {/* Wishlist Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-13">
              {wishlistItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative h-[450px] w-[331px] transition duration-300 group cursor-pointer"
                >

                  {/* Discount badge */}
                  <div className="absolute top-4 right-4 bg-[#077D40] text-white text-[15px] px-3 py-1 rounded-full z-10">
                    Save 20%
                  </div>

                  <div className="relative">
                    {/* Product Image */}
                    <div className="">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-[331.75px] h-[288px] object-cover"
                      />
                    </div>

                    {/* Heart Icon (top-right) */}
                  <div className="absolute bottom-3 right-3">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="rounded-full"
                    >
                      <Heart className="text-green-600 w-10 fill-green-600" />
                    </button>
                  </div>
                  </div>
                  

                  {/* Product Details */}
                  <div className="">
                    <div className="flex items-center justify-between h-[24px]">
                      <div className="">
                        <p className="text-[14px] font-bold text-[#000000] truncate">
                        {item.title || "Organic Product"}
                      </p>
                      </div>
                      <div className="flex text-[16px]">★★★★★</div>
                    </div>

                    <div className="flex items-center mt-[15px] justify-between">
                     <div className="">
                       <p className="text-gray-600 text-[14px]">
                        {item.price
                          ? `₹${item.price}`
                          : "₹95.00"}
                      </p>
                     </div>
                      <div className="">
                        <p className="text-[12px] text-[#3333338C]/55">
                        4.86 (887k Reviews)
                      </p>
                      </div>
                    </div>

                    

                    {/* Quantity Controls */}
                    {/* <div className="flex items-center justify-center border rounded mt-4 w-28 mx-auto">
                      <button
                        onClick={() =>
                          item.quantity > 1 &&
                          updateItemQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="px-3 border-x">{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div> */}

                    {/* Subtotal */}
                    {/* <p className="text-center text-gray-700 font-semibold mt-3">
                      Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                    </p> */}

                    {/* Buttons */}
                    {/* <div className="mt-4 flex flex-col gap-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Add to Cart
                      </button>

                      <button
                        onClick={() => {
                          removeFromWishlist(item.id);
                          toast.info(`${item.title} removed from wishlist`);
                        }}
                        className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </div> */}

                    <div className="mt-[25px] w-[332px] hover:text-white text-[14px] h-[51px]">
                      <button
                        className={`w-full h-[51px] border border-black rounded hover:bg-[#077D40] hover:text-white transition ${
                          addedProductId === (item.id)
                            ? "bg-[#077D40] text-white"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(item, index);
                        }}
                      >
                        {addedProductId === (item.id)
                          ? "Added ✅"
                          : "Add to your Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon & Clear Buttons */}
            {/* <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4">
              <form onSubmit={applyCoupon} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 w-56"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
                >
                  Apply
                </button>
              </form>

              {couponMessage && (
                <p
                  className={`text-sm ${
                    discount > 0 ? "text-green-700" : "text-red-500"
                  }`}
                >
                  {couponMessage}
                </p>
              )}

              <button
                onClick={clearWishlist}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700"
              >
                Clear Wishlist
              </button>
            </div> */}

            {/* Summary */}
            {/* <div className="bg-white shadow rounded-lg p-6 mt-10 w-full sm:w-1/2 lg:w-1/3 ml-auto">
              <div className="flex justify-between py-2 border-b">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Discount</span>
                <span>{(discount * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between py-2 font-semibold text-lg">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistMain;
function getImage(product: ProductType, index: number): string {
  // Prefer explicit image field, then productImages array, fallback to a placeholder.
  if (!product) return "/assets/images/products/Oats.png";
  if (product.image && typeof product.image === "string" && product.image.trim() !== "") {
    return product.image;
  }
  // ProductImage might have different field names depending on API
  const imgs = (product.productImages || []) as any[];
  if (imgs.length > 0) {
    const first = imgs[0];
    return first.image_url || first.url || first.image || "/assets/images/products/Oats.png";
  }
  return "/assets/images/products/Oats.png";
}

