"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface OrderItem {
  product_name: string;
  price: number;
  quantity: number;
}

interface ShippingDetails {
  firstName?: string;
  lastName?: string;
  cityName?: string;
  state?: string;
  pinCode?: string;
  phone?: string;
  address?: string;
}

interface OrderDetails {
  order_id: number;
  user_name: string;
  user_email: string;
  total_amount: string;
  payment_method: string;
  order_status: string;
  created_at: string;
  shipping_details: string;
  items: OrderItem[];
}

export default function OrderInvoicePage() {
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ORDER ---------------- */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `https://ekomart-backend.onrender.com/api/adminorder/orders/${id}`
        );
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  /* ---------------- PRINT ---------------- */
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const original = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  };

  if (loading) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  if (!order) {
    return <p className="p-10 text-center">Order not found</p>;
  }

  const shipping: ShippingDetails = JSON.parse(order.shipping_details || "{}");

  const subTotal = order.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div
        ref={printRef}
        className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">
            Order #{order.order_id}
          </h1>
          <span className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* CUSTOMER */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Customer Details</h3>
            <p className="text-gray-700">{order.user_name}</p>
            <p className="text-gray-500">{order.user_email}</p>
            <p className="text-gray-500">Phone: {shipping.phone}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Order Info</h3>
            <p>Status: <span className="font-medium">{order.order_status}</span></p>
            <p>Payment: {order.payment_method}</p>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Billing Address</h3>
            <p>{shipping.firstName} {shipping.lastName}</p>
            <p>{shipping.address}</p>
            <p>{shipping.cityName}, {shipping.state}</p>
            <p>{shipping.pinCode}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p>{shipping.firstName} {shipping.lastName}</p>
            <p>{shipping.address}</p>
            <p>{shipping.cityName}, {shipping.state}</p>
            <p>{shipping.pinCode}</p>
          </div>
        </div>

        {/* ORDER TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Item</th>
                <th className="border px-4 py-2 text-center">Price</th>
                <th className="border px-4 py-2 text-center">Qty</th>
                <th className="border px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{item.product_name}</td>
                  <td className="border px-4 py-2 text-center">₹{item.price}</td>
                  <td className="border px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border px-4 py-2 text-right">
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="border px-4 py-2 text-right font-medium">
                  Subtotal
                </td>
                <td className="border px-4 py-2 text-right">₹{subTotal}</td>
              </tr>
              <tr>
                <td colSpan={3} className="border px-4 py-2 text-right font-bold">
                  Grand Total
                </td>
                <td className="border px-4 py-2 text-right font-bold">
                  ₹{order.total_amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 mt-6 no-print">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
