"use client";

import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  // ⭐ SHIPPING STATE
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    phone: "",
  });

  // UPDATE SHIPPING INPUT
  const handleShippingChange = (e: any) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");

      if (!token || !user_id) {
        toast.error("User not logged in");
        setLoading(false);
        return;
      }

      // ⭐ 1. FETCH CART ITEMS
      const cartResponse = await axios.get(
        `${API_BASE_URL}/api/cart/getusercart/${user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const cartItems = cartResponse.data || [];

      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        toast.error("Your cart is empty!");
        setLoading(false);
        return;
      }

      // ⭐ IMAGE TYPE INCLUDED IN CART
      console.log("Cart Items with images:", cartItems);

      // ⭐ 2. PLACE ORDER
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/cart/place-order`,
        {
          type: "cart",
          payment_method: paymentMethod,

          // ⭐ SHIPPING DETAILS ADDED
          shipping: {
            name: shipping.name,
            address: shipping.address,
            phone: shipping.phone,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order placed successfully!");
      console.log("Order Success:", orderResponse.data);

      // Redirect after success
      // setTimeout(() => {
      //   window.location.href = "/order-details/" + orderResponse.data.order_id;
      // }, 1200);

    } catch (error) {
      toast.error("Order failed!");
      console.error("Order Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 flex justify-center">
      <ToastContainer />

      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6">

        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Select Payment Method
        </h2>

        {/* ⭐ SHIPPING FORM */}
        <div className="space-y-3 border p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold">Shipping Details</h3>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={shipping.name}
            onChange={handleShippingChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shipping.address}
            onChange={handleShippingChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={shipping.phone}
            onChange={handleShippingChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* ⭐ PAYMENT TYPE */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose Payment Type</h3>

          {/* COD */}
          <label className="flex items-center p-3 border rounded-lg cursor-pointer gap-3">
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            <span>Cash On Delivery (COD)</span>
          </label>

          {/* ONLINE */}
          <label className="flex items-center p-3 border rounded-lg cursor-pointer gap-3">
            <input
              type="radio"
              name="payment"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            <span>Online Payment</span>
          </label>
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className={`w-full p-3 text-white rounded-lg transition ${
            loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
