"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/components/header/CartContext";
import { ChevronDown, ChevronUp, Trash2, X } from "lucide-react";
import Cart from "@/components/header/Cart";
import CheckOutMain from "../checkout/CheckOutMain";
import router from "next/router";

interface CartItem {
  regularPrice: any;
  productImage: string;
  id: string | number;
  image: string;
  title: string;
  productName: string;
  price: number;
  quantity: number;
  active: boolean;
}

const CartMain = () => {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    // If user NOT logged in → redirect to login page
    if (!token) {
      router.push("/login?redirect=checkout");
      return;
    }

    // If logged in → show checkout
    setShowCheckout(true);
    router.push("/checkout");
  };
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.price;
      const quantity = item.quantity || 1;
      return acc + (isNaN(price) ? 0 : price * quantity);
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  // const applyCoupon = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (coupon === "12345") {
  //     setDiscount(0.25);
  //     setCouponMessage("Coupon applied -25% successfully");
  //   } else {
  //     setDiscount(0);
  //     setCouponMessage("Coupon code is incorrect");
  //   }
  // };

  // const clearCart = () => {
  //   cartItems.forEach((item) => removeFromCart(item.id));
  //   setCoupon("");
  //   setDiscount(0);
  // };

  const finalTotal = subtotal - subtotal * discount;

  return (
    <div className="w-full max-w-[1430px] mx-auto py-12 px-4 sm:px-6 lg:px-8 xl:px-0">
      <div className="flex flex-col xl:flex-row gap-10">
        {/* ======================== CART SECTION ======================== */}
        <div className="w-full xl:max-w-[800px] mx-auto bg-white p-6 rounded-lg">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Cart />
            <h1 className="text-2xl md:text-3xl font-semibold">
              Shopping Cart
            </h1>
          </div>

          <p className="ml-1 mt-3 text-gray-600">
            You have {cartItems.length} items in your cart
          </p>

          {/* ======================== CART ITEMS ======================== */}
          {cartItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Your cart is empty.
            </div>
          )}

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg mb-4 mt-3 p-4"
            >
              {/* MOBILE LAYOUT */}
              <div className="md:hidden block">
                <img
                  src="/assets/images/products/Oats.png"
                  className="w-full h-72 object-cover rounded-md"
                />

                <div className="mt-3 flex items-center justify-between">
                  <div className="">
                    <p className="text-lg font-semibold">
                      {item.productName || "Product Name"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.description || "Product Details"}
                    </p>
                  </div>

                  <div className="">
                    {/* Delete Button Mobile */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-4 text-red-500 flex items-center gap-2"
                    >
                      <Trash2 size={18} /> Remove
                    </button>
                  </div>
                </div>

                {/* Quantity + Price */}
                <div className="flex justify-between items-center mt-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateItemQuantity(item.id, item.quantity - 1)
                      }
                      className="w-7 h-7 flex justify-center items-center border rounded-md"
                    >
                      <ChevronDown size={16} />
                    </button>

                    <span className="font-medium">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity + 1)
                      }
                      className="w-7 h-7 flex justify-center items-center border rounded-md"
                    >
                      <ChevronUp size={16} />
                    </button>
                  </div>

                  <p className="font-semibold text-lg">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* ================= DESKTOP/TABLET layout (Unchanged) ================= */}
              <div className="hidden md:grid grid-cols-4 gap-4 items-center">
                <img
                  src="/assets/images/products/Oats.png"
                  className="w-[110px] h-[90px] object-cover rounded-md"
                />

                <div>
                  <p className="text-lg font-semibold">{item.productName}</p>
                  <p className="text-sm text-gray-600">Product Details</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity + 1)
                    }
                    className="text-gray-600"
                  >
                    <ChevronUp />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateItemQuantity(item.id, item.quantity - 1)
                    }
                    className="text-gray-600"
                  >
                    <ChevronDown />
                  </button>
                </div>

                {/* Price + Delete */}
                <div className="flex items-center justify-end gap-4">
                  <p className="font-semibold">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button className="border border-black py-3 w-full hover:bg-gray-200">
              Continue Shopping
            </button>

            <button className="bg-[#077D40] text-white py-3 w-full hover:bg-[#065d30]">
              Update Cart
            </button>
          </div>
        </div>

        {/* ======================== ORDER SUMMARY ======================== */}
        <div className="w-full xl:max-w-[660px] mx-auto bg-white p-6 rounded-lg">
          <h2 className="text-center text-3xl font-bold mb-6">Order Summary</h2>

          <div className="flex justify-between text-lg mb-4">
            <span className="text-gray-600 font-bold">Subtotal :</span>
            <span className="font-bold">Rs. {subtotal.toFixed(2)}</span>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <p className="text-lg font-medium">
              Special instructions for seller
            </p>

            <textarea
              className="w-full border border-green-600 rounded-lg p-3 mt-3 h-40"
              placeholder=""
              onChange={(e) => setSpecialInstructions(e.target.value)}
            ></textarea>
          </div>

          <p className="text-center text-sm text-gray-500">
            Shipping, taxes, and discounts will be calculated at checkout.
          </p>

          {/* Checkout Button */}
          <div>
            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-[#018F45] text-white py-3 text-lg rounded-md shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>

          {/* Country / State */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-lg mb-2">Country</p>
              <select className="w-full border rounded-lg py-3 px-3 text-sm">
                <option value="">Select Country</option>
                <option value="india">India</option>
                <option value="usa">USA</option>
                <option value="uk">UK</option>
              </select>
            </div>

            <div>
              <p className="text-lg mb-2">State</p>
              <select className="w-full border rounded-lg py-3 px-3 text-sm">
                <option value="">Select State</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="california">California</option>
                <option value="texas">Texas</option>
              </select>
            </div>
          </div>

          {/* ZIP */}
          <div className="mt-6">
            <p className="text-lg mb-2">Zip / Postal Code</p>
            <input
              type="text"
              placeholder="Enter Zip Code"
              className="w-full border rounded-lg px-3 py-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* ======================== CHECKOUT MODAL ======================== */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative w-full scrollbar-hide max-w-[570px] max-h-[90vh] overflow-y-auto rounded-lg p-4">
            <div className="fixed top-4 xl:top-9 right-26 xl:right-160">
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 md:right-3 right-7 text-gray-600"
              >
                <X size={28} />
              </button>
            </div>

            <CheckOutMain />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartMain;
