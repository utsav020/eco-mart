"use client";

import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { OrderDetails } from "@/lib/types";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [detail, setDetail] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        // Correct API path
        const data = await apiGet(`/api/user/orderdetails/${orderId}`);

        console.log("ORDER DETAILS API RESPONSE:", data);

        const orderData = data.order || null;
        setDetail(orderData);
      } catch (err) {
        console.error("Error loading order details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [orderId]);

  if (loading) return <p className="text-center p-5">Loading order details...</p>;

  if (!detail)
    return <p className="text-center p-5">No details found for this order.</p>;

  const items = Array.isArray(detail.items) ? detail.items : [];

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-semibold mb-6">
        Order #{detail.order_id}
      </h1>

      {/* ORDER SUMMARY */}
      <div className="border p-4 rounded-lg mb-6 shadow-sm space-y-2 bg-gray-50">
        <p><strong>Status:</strong> {detail.order_status}</p>
        <p><strong>Payment Method:</strong> {detail.payment_method}</p>
        <p><strong>Total Amount:</strong> ₹{detail.total_amount}</p>
        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(detail.order_date).toLocaleString()}
        </p>
      </div>

      {/* USER DETAILS */}
      <div className="border p-4 rounded-lg mb-6 shadow-sm bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">Customer Information</h2>

        <p><strong>Name:</strong> {detail.user.name}</p>
        <p><strong>Email:</strong> {detail.user.email}</p>
        <p><strong>Phone:</strong> {detail.user.phoneNo}</p>
        <p><strong>Address:</strong> {detail.user.address}</p>
        <p><strong>City:</strong> {detail.user.city}</p>
        <p><strong>Pincode:</strong> {detail.user.pincode}</p>
      </div>

      {/* ITEM LIST */}
      <h2 className="text-xl font-semibold mb-4">Products in Order</h2>

      {items.length === 0 ? (
        <p>No items found in this order.</p>
      ) : (
        <div className="space-y-5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="border p-5 rounded-lg shadow flex flex-col gap-3 bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold">{item.productName}</p>
                  <p className="text-sm text-gray-600">
                    Category: {item.categoryName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-green-700">
                    Price: ₹{item.price}
                  </p>
                  <p className="font-semibold text-blue-700">
                    Subtotal: ₹{item.subtotal}
                  </p>
                </div>
              </div>

              {/* ADDITIONAL PRODUCT DETAILS */}
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mt-2">
                <p><strong>Product ID:</strong> {item.product_id}</p>
                <p><strong>Variant ID:</strong> {item.product_variant_id ?? "N/A"}</p>
                <p><strong>Variant Name:</strong> {item.productVariantName || "N/A"}</p>
                <p><strong>Weight:</strong> {item.weights}</p>
                <p><strong>Regular Price:</strong> ₹{item.regularPrice}</p>
                <p><strong>Sale Price:</strong> ₹{item.salePrice}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Subtotal:</strong> ₹{item.subtotal}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
