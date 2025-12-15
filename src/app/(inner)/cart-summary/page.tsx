"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import {
  ShoppingCart,
  Package,
  Tag,
  CreditCard,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import router from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderThree from "@/components/header/HeaderThree";

export default function CartSummaryPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⭐ PAYMENT POPUP STATE
  const [popupOpen, setPopupOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  // ⭐ SHIPPING DETAILS + USER PROFILE
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
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setError("Please login to view your cart summary");
      setLoading(false);
      return;
    }

    fetchSummary(token);
  }, []);

  // FETCH CART SUMMARY
  const fetchSummary = async (token: string) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/api/cart/checkoutcart/summary`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data.data ?? response.data;

      const items = data.items ?? [];

      const totalItems = items.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
      );

      const totalPrice = items.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      );

      setSummary({
        items,
        totalItems,
        totalPrice,
        discount: data.discount ?? 0,
        finalPrice: data.finalPrice ?? totalPrice - (data.discount ?? 0),
      });
    } catch (err) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  // DELETE ITEM
  const removeItem = async (cart_id: number) => {
    try {
      await axios.delete(
        `https://ekomart-backend.onrender.com/api/cart/removecartitem/${cart_id}`,
        { data: { cart_id } }
      );
      fetchCart();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (token) fetchSummary(token);
  };

  // UPDATE QUANTITY
  const updateQuantity = async (cart_id: number, quantity: number) => {
    if (quantity < 1) return;

    try {
      await axios.put(
        `https://ekomart-backend.onrender.com/api/cart/updatecart/${cart_id}`,
        { cart_id, quantity }
      );
      fetchCart();
    } catch (err) {
      console.log("Quantity update error:", err);
    }
  };

  // ⭐ LOAD USER PROFILE WHEN POPUP OPENS
  const openPaymentPopup = async () => {
    setPopupOpen(true);
    setProfileLoading(true);

    try {
      const user_id = localStorage.getItem("user_id") || 2;

      const response = await axios.get(
        `https://ekomart-backend.onrender.com/api/user/profile/${user_id}`
      );

      const data = response.data.user;

      setProfile(data);

      // Autofill shipping fields
      setShipping({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        cityName: data.cityName,
        pinCode: data.pinCode,
        address: data.address,
        phone: data.phoneNo,
        state: data.state,
      });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // ⭐ PLACE ORDER
  const placeOrder = async () => {
    setPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");

      if (!token || !user_id) {
        toast.error("User not logged in");
        return;
      }

      const cartResponse = await axios.get(
        `${API_BASE_URL}/api/cart/getusercart/${user_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!Array.isArray(cartResponse.data) || cartResponse.data.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      const order = await axios.post(
        `${API_BASE_URL}/api/cart/place-order`,
        {
          type: "cart",
          payment_method: paymentMethod,
          shipping,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order placed successfully!");

      setTimeout(() => {
        window.location.href = `/account`;
      }, 1200);
    } catch (err) {
      console.log(err);
      toast.error("Order Failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleContinueShopping = () => window.history.back();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
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

        {/* ITEMS + SUMMARY */}
        <div className="grid grid-cols-1 mt-[100px] lg:grid-cols-3 gap-8">
          {/* LEFT SIDE ITEMS */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Package />
              Order Items ({summary.totalItems})
            </h2>

            {summary.items.map((item: any) => (
              <div
                key={item.cart_id}
                className="flex items-center justify-between border p-4 rounded-lg mb-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.cart_id, item.quantity + 1)
                    }
                  >
                    <ChevronUp />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateQuantity(item.cart_id, item.quantity - 1)
                    }
                  >
                    <ChevronDown />
                  </button>
                </div>

                <div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>

                <button
                  onClick={() => removeItem(item.cart_id)}
                  className="text-red-500"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard />
              Summary
            </h2>

            <p className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{summary.totalPrice}</span>
            </p>

            <p className="flex justify-between text-green-600 mb-2">
              <span>Discount</span>
              <span>- ₹{summary.discount}</span>
            </p>

            <p className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>₹{summary.finalPrice}</span>
            </p>

            <button
              onClick={openPaymentPopup}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ FULL SCREEN PAYMENT POPUP ⭐ */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-999 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-8 relative">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Complete Your Payment
            </h2>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

              <div className="space-y-3">
                {/* FIRST + LAST NAME */}
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="w-full">
                    <label>First Name</label>
                    <input
                      name="firstName"
                      value={shipping.firstName}
                      onChange={(e) =>
                        setShipping({ ...shipping, firstName: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div className="w-full">
                    <label>Last Name</label>
                    <input
                      name="lastName"
                      value={shipping.lastName}
                      onChange={(e) =>
                        setShipping({ ...shipping, lastName: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label>Phone No</label>
                  <input
                    name="phone"
                    value={shipping.phone}
                    onChange={(e) =>
                      setShipping({ ...shipping, phone: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label>Street Address</label>
                  <input
                    name="address"
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping({ ...shipping, address: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                {/* City + Pin */}
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="w-full">
                    <label>City</label>
                    <input
                      name="cityName"
                      value={shipping.cityName}
                      onChange={(e) =>
                        setShipping({ ...shipping, cityName: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  
                  {/* STATE */}
                  <div className="w-full">
                    <label>State</label>
                    <input
                      name="state"
                      value={shipping.state}
                      onChange={(e) =>
                        setShipping({ ...shipping, state: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                </div>

                {/* ZIP CODE */}
                <div>
                  <label>Zip/Postal Code</label>
                  <input
                    name="zipCode"
                    value={shipping.pinCode}
                    onChange={(e) =>
                      setShipping({ ...shipping, pinCode: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT TYPE */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Select Payment Method
              </h3>

              <label className="flex items-center gap-3 border p-3 mb-3 rounded-lg">
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash On Delivery (COD)
              </label>

              <label className="flex items-center gap-3 border p-3 rounded-lg">
                <input
                  type="radio"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                Online Payment
              </label>
            </div>

            {/* PLACE ORDER BUTTON */}
            <div className="flex gap-4 justify-end">
              <div className="w-[200px] py-3 flex items-center justify-center hover:bg-[#077D40] hover:text-white text-black border rounded-sm">
                <button 
                  className=""
                  onClick={() => setPopupOpen(false)}>
                  Cancel
                </button>
              </div>

              <div className="w-[200px]">
                <button
                  onClick={placeOrder}
                  disabled={placingOrder}
                  className={`w-full py-3 text-white rounded-sm ${
                    placingOrder
                      ? "bg-gray-500"
                      : "bg-[#077D40] hover:bg-[#077D40]"
                  }`}
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
