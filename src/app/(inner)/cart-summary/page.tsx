"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import {
  Package,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Trash2,
  Loader2,
  CheckCircle,
  ShoppingBag,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderThree from "@/components/header/HeaderThree";

export default function CartSummaryPage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [popupOpen, setPopupOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cityName: "",
    pinCode: "",
    address: "",
    phone: "",
    state: "",
  });

  /* ---------------- FETCH CART SUMMARY ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchSummary(token);
  }, []);

  const fetchSummary = async (token: string) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/cart/checkoutcart/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data.data ?? res.data;
      const items = data.items ?? [];

      const totalItems = items.reduce((a: number, i: any) => a + i.quantity, 0);
      const totalPrice = items.reduce(
        (a: number, i: any) => a + i.price * i.quantity,
        0
      );

      setSummary({
        items,
        totalItems,
        totalPrice,
        discount: data.discount ?? 0,
        finalPrice: data.finalPrice ?? totalPrice,
      });
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PLACE ORDER ---------------- */
  const placeOrder = async () => {
    setPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");
      if (!token || !user_id) return;

      const response = await axios.post(
        `${API_BASE_URL}/api/cart/place-order`,
        {
          type: "cart",
          payment_method: paymentMethod,
          shipping,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Generate order number from response or create one
      const orderNum =
        response.data?.orderNumber || `ORD${Date.now().toString().slice(-8)}`;
      setOrderNumber(orderNum);

      // 🎉 SUCCESS
      setPopupOpen(false);
      setOrderSuccess(true);

      // 🔊 Play GPay sound
      setTimeout(() => {
        audioRef.current?.play();
      }, 300);
    } catch {
      toast.error("Order failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ---------------- LOADER ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  /* ---------------- SUCCESS SCREEN ---------------- */
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
        <audio
          ref={audioRef}
          src="/assets/images/sound/gpay-success.mp3"
          preload="auto"
        />

        {/* Navigation Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-800">
                  ShopEase
                </span>
              </div>
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Success Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border border-green-100">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
                {/* Animated rings */}
                <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-0 border-2 border-green-300 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Success Text */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Order Placed Successfully
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Thank you for your purchase! Your order has been confirmed and
                will be shipped soon.
              </p>

              {/* Order Number */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="text-xl font-bold text-green-700">
                  {orderNumber}
                </p>
              </div>
            </div>

            {/* Order Details Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Total</span>
                  <span className="font-semibold">
                    ₹{summary?.totalPrice || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600 font-semibold">
                    - ₹{summary?.discount || 0}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total Amount</span>
                  <span className="text-green-700">
                    ₹{summary?.finalPrice || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Shipping to
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {shipping.firstName} {shipping.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{shipping.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">
                    {shipping.address}, {shipping.cityName}, {shipping.state} -{" "}
                    {shipping.pinCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">
                    {paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/account")}
                className="flex-1 max-w-xs bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                View My Orders
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 max-w-xs bg-white border border-green-600 text-green-600 hover:bg-green-50 py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                You will receive an order confirmation email shortly. For any
                queries, contact us at support@shopease.com
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
            <p className="mt-2">Your satisfaction is our priority</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* MAIN PAGE */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between">
          <div className="flex items-center gap-3">
            <HeaderThree />
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-[120px] px-4 grid lg:grid-cols-3 gap-8">
          {/* ITEMS */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex gap-2">
              <Package /> Order Items ({summary?.totalItems || 0})
            </h2>

            {summary?.items?.map((item: any) => (
              <div
                key={item.cart_id}
                className="flex justify-between items-center border p-4 rounded mb-3 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image_url}
                    className="w-20 h-20 rounded object-cover"
                    alt={item.productName}
                  />
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-green-600">₹{item.price} each</p>
                  </div>
                </div>

                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-6">
            <h2 className="text-xl font-semibold mb-4 flex gap-2">
              <CreditCard /> Summary
            </h2>

            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{summary?.totalPrice || 0}</span>
              </p>

              <p className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹{summary?.discount || 0}</span>
              </p>

              <p className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span className="text-green-700">
                  ₹{summary?.finalPrice || 0}
                </span>
              </p>
            </div>

            <button
              onClick={() => setPopupOpen(true)}
              className="w-full mt-6 bg-[#077D40] hover:bg-[#066933] text-white py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ FULL SCREEN PAYMENT POPUP ⭐ */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPopupOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-4 text-center">
              Complete Your Payment
            </h2>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

              <div className="space-y-3">
                {/* FIRST + LAST NAME */}
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={shipping.firstName}
                      onChange={(e) =>
                        setShipping({ ...shipping, firstName: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={shipping.lastName}
                      onChange={(e) =>
                        setShipping({ ...shipping, lastName: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={shipping.phone}
                    onChange={(e) =>
                      setShipping({ ...shipping, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    name="address"
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping({ ...shipping, address: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter full address"
                  />
                </div>

                {/* City + State */}
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      name="cityName"
                      value={shipping.cityName}
                      onChange={(e) =>
                        setShipping({ ...shipping, cityName: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter city"
                    />
                  </div>

                  {/* STATE */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      name="state"
                      value={shipping.state}
                      onChange={(e) =>
                        setShipping({ ...shipping, state: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                {/* ZIP CODE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip/Postal Code
                  </label>
                  <input
                    name="zipCode"
                    value={shipping.pinCode}
                    onChange={(e) =>
                      setShipping({ ...shipping, pinCode: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT TYPE */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Select Payment Method
              </h3>

              <label className="flex items-center gap-3 border p-3 mb-3 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="text-green-600 focus:ring-green-500"
                />
                <div>
                  <p className="font-medium">Cash On Delivery (COD)</p>
                  <p className="text-sm text-gray-500">
                    Pay when you receive your order
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="text-green-600 focus:ring-green-500"
                />
                <div>
                  <p className="font-medium">Online Payment</p>
                  <p className="text-sm text-gray-500">
                    Pay now using card, UPI, or wallet
                  </p>
                </div>
              </label>
            </div>

            {/* PLACE ORDER BUTTON */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={() => setPopupOpen(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                disabled={placingOrder}
                className={`px-8 py-3 text-white rounded transition-colors ${
                  placingOrder
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#077D40] hover:bg-[#066933]"
                }`}
              >
                {placingOrder ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
