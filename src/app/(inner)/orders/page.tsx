"use client";

import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { OrderItem } from "@/lib/types";
import Link from "next/link";
import { getUserId } from "@/lib/auth";

export default function OrdersPage() {
  const userId = getUserId();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        // ✅ Correct API path (remove /api)
        const data = await apiGet(`/api/user/getuserorder/${userId}`);

        console.log("Orders API Response:", data);

        // Backend returns array directly → { order_id, total_amount, ... }
        const orderList = Array.isArray(data) ? data : data.orders || [];

        setOrders(orderList);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  if (loading) {
    return <p className="text-center p-5">Loading orders...</p>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-[1430px] mx-auto p-5">
        <h1 className="text-2xl font-semibold mb-5">My Orders</h1>
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1430px] mx-auto p-5">
      <h1 className="text-2xl font-semibold mb-5">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.order_id}
            href={`/orders/${order.order_id}`}
            className="block p-4 rounded-lg h-[145px] shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              {/* LEFT SIDE */}
              <div>
                <div className="">
                  <img
                    className="w-[224.57px] h-[109px] object-cover"
                    src={order.items?.[0]?.image_url || "/placeholder.png"}
                    alt={`Order ${order.order_id}`}
                  />
                </div>
                {/* <p className="font-medium">Order #{order.order_id}</p> */}

                {/* <p className="text-sm text-gray-600">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "No date"}
                </p> */}

                {/* <p className="text-sm text-gray-700">
                  Payment: <strong>{order.payment_method}</strong>
                </p> */}

                {/* <p className="text-sm">
                  Items: <strong>{order.items?.length || 0}</strong>
                </p> */}
              </div>

              <div className="w-[430px] h-[84px]">
                <div className="text-[15px] font-bold">
                  <p>{order.items?.[0]?.productName || "Product Name"}</p>
                </div>

                <div className="w-[430px] h-14 text-[16px] text-[#00000080]">
                    <p>{order.items?.[0]?.product_description || "Description"}</p>
                </div>
              </div>

              <div className="w-[100px] text-center h-[25px]">
                <p className="font-semibold text-lg">
                  Rs. {order.items?.[0]?.price || "0"}
                </p>
              </div>

              <div className="">
                <p
                  className={`text-sm ${
                    order.order_status === "Pending"
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {order.order_status}
                </p>
              </div>

              <div className="w-[100px] bg-[#077D40] text-white text-[14px] h-10 flex items-center justify-center border-2">
                <button>Track Order</button>
              </div>

              <div className="w-[100px] border-[#00000080] border h-10 flex items-center justify-center">
                <button className="text-[14px]">Cancel Order</button>
              </div>

              {/* RIGHT SIDE */}
              <div className="text-right">
                {/* <p className="font-semibold text-lg">
                  ₹{order.total_amount}
                </p> */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
