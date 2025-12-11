"use client";

import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

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

      // ⭐ CHECK CART IS EMPTY
      const cartResponse = await axios.get(
        `${API_BASE_URL}/api/cart/getusercart/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cartItems = cartResponse.data || [];
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        toast.error("Your cart is empty!");
        setLoading(false);
        return;
      }

      // ⭐ PLACE ORDER
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/cart/place-order`,
        {
          type: "cart",
          payment_method: paymentMethod,
          shipping: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully!");
      console.log("Order Success:", orderResponse.data);

      // setTimeout(() => {
      //   window.location.href = "/order-details";
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

          {/* Online */}
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
