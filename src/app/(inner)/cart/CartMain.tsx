"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Trash2, X } from "lucide-react";
import router from "next/router";
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ FIXED

interface CartItem {
  cart_id: number;
  productName: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

const CartMain = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const router = useRouter(); // ✅ FIXED
  

  const user_id = Number(localStorage.getItem("user_id")); // STATIC as you required

  // ================================
  // Fetch Cart From Backend
  // ================================
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `https://ekomart-backend.onrender.com/api/cart/getusercart/${user_id}`
      );

      const data = Array.isArray(res.data) ? res.data : [res.data];

      setCartItems(
        data.map((item: any) => ({
          cart_id: item.cart_id,
          productName: item.productName,
          price: item.salePrice ?? 0,
          quantity: item.quantity,
          image_url: item.image_url,
        }))
      );
    } catch (err) {
      console.log("Fetch Cart Error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Subtotal Calculation
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  // ================================
  // UPDATE QUANTITY API
  // ================================
  const updateQuantity = async (cart_id: number, quantity: number) => {
    try {
      await axios.put(
        `https://ekomart-backend.onrender.com/api/cart/updatecart/${cart_id}`,
        {
          cart_id,
          quantity,
        }
      );
      fetchCart();
    } catch (err) {
      console.log("Update Quantity Error:", err);
    }
  };

  // ================================
  // REMOVE ITEM API
  // ================================
  const removeItem = async (cart_id: number) => {
    try {
      await axios.delete(
        `https://ekomart-backend.onrender.com/api/cart/removecartitem/${cart_id}`,
        {
          data: {
            cart_id,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.log("Delete Item Error:", err);
    }
  };

  // ================================
  // CHECK LOGIN + REDIRECT
  // ================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login?redirect=checkout");
      return;
    }

    // setShowCheckout(true);
    router.push("/cart-summary");
  };

  const finalTotal = subtotal - subtotal * discount;

  return (
    <div className="w-full max-w-[1430px] mx-auto py-12 px-4 sm:px-6 lg:px-8 xl:px-0">
      <div className="flex flex-col xl:flex-row gap-10">
        {/* ======================== CART SECTION ======================== */}
        <div className="w-full xl:max-w-[800px] mx-auto bg-white p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Shopping Cart
            </h1>
          </div>

          <p className="ml-1 mt-3 text-gray-600">
            You have {cartItems.length} items in your cart
          </p>

          {cartItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Your cart is empty.
            </div>
          )}

          {cartItems.map((item) => (
            <div
              key={item.cart_id}
              className="bg-white shadow-md rounded-lg mb-4 mt-3 p-4"
            >
              {/* MOBILE LAYOUT */}
              <div className="md:hidden block">
                <img
                  src={item.image_url ?? "/assets/images/products/Oats.png"}
                  className="w-full h-72 object-cover rounded-md"
                />

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{item.productName}</p>
                  </div>

                  <button
                    onClick={() => removeItem(item.cart_id)}
                    className="mt-4 text-red-500 flex items-center gap-2"
                  >
                    <Trash2 size={18} /> Remove
                  </button>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item.cart_id, item.quantity - 1)
                      }
                      className="w-7 h-7 flex justify-center items-center border rounded-md"
                    >
                      <ChevronDown size={16} />
                    </button>

                    <span className="font-medium">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.cart_id, item.quantity + 1)
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

              {/* DESKTOP VIEW */}
              <div className="hidden md:grid grid-cols-4 gap-4 items-center">
                <img
                  src={item.image_url ?? "/assets/images/products/Oats.png"}
                  className="w-[110px] h-[90px] object-cover rounded-md"
                />

                <div>
                  <p className="text-lg font-semibold">{item.productName}</p>
                  <p className="text-sm text-gray-600">Product Details</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.cart_id, item.quantity + 1)
                    }
                    className="text-gray-600"
                  >
                    <ChevronUp />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateQuantity(item.cart_id, item.quantity - 1)
                    }
                    className="text-gray-600"
                  >
                    <ChevronDown />
                  </button>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <p className="font-semibold">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="text-red-500"
                    onClick={() => removeItem(item.cart_id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button 
              onClick={() => router.push('/shop')}
              className="border border-black cursor-pointer py-3 w-full hover:bg-gray-200">
              Continue Shopping
            </button>

            <button className="bg-[#077D40] cursor-pointer text-white py-3 w-full hover:bg-[#065d30]">
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

          <div className="mb-6">
            <p className="text-lg font-medium">
              Special instructions for seller
            </p>
            <textarea
              className="w-full border border-green-600 rounded-lg p-3 mt-3 h-40"
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>

          <p className="text-center text-sm text-gray-500">
            Shipping, taxes, and discounts will be calculated at checkout.
          </p>

          <div className="cursor-pointer">
            <a href="/cart-summary">
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-[#018F45] text-white py-3 text-lg rounded-md shadow-md"
              >
                Proceed to Checkout
              </button>
            </a>
          </div>

          {/* Country / State */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-lg mb-2">Country</p>
              <select className="w-full border rounded-lg py-3 px-3 text-sm">
                <option>Select Country</option>
              </select>
            </div>

            <div>
              <p className="text-lg mb-2">State</p>
              <select className="w-full border rounded-lg py-3 px-3 text-sm">
                <option>Select State</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-lg mb-2">Zip / Postal Code</p>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* ======================== CHECKOUT MODAL ======================== */}
      {/* {showCheckout && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative w-full max-w-[570px] max-h-[90vh] overflow-y-auto rounded-lg p-4">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute top-4 right-4 text-gray-600"
            >
              <X size={28} />
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default CartMain;
