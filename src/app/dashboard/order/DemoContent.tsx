"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { TableColumn } from "react-data-table-component";
import { useRouter } from "next/navigation";

interface ShippingDetails {
  cityName?: string;
  state?: string;
}

interface OrderRow {
  order_id: number;
  user_name: string;
  user_email: string;
  total_amount: string;
  payment_method: string;
  order_status: string;
  created_at: string;
  shipping_details: string;
}

const BASE_URL = "https://ekomart-backend.onrender.com/api/adminorder/orders";

const STATUSES = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrdersOverviewPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [activeStatus, setActiveStatus] = useState("All");

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async (status: string) => {
    try {
      setLoading(true);

      const url =
        status === "All"
          ? BASE_URL
          : `${BASE_URL}/status/${status.toLowerCase()}`;

      const res = await axios.get(url);
      setOrders(res.data || []);
      setActiveStatus(status);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchOrders("All");
  }, []);

  /* ---------------- HELPERS ---------------- */
  const parseShipping = (value: string): ShippingDetails => {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-300";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-300";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-300";
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-300";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      setUpdatingId(orderId);

      await axios.put(`${BASE_URL}/${orderId}/status`, {
        order_status: status,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, order_status: status } : o
        )
      );
    } catch (error) {
      alert("Failed to update order status");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns: TableColumn<OrderRow>[] = [
    {
      name: "Order ID",
      selector: (row) => row.order_id,
      sortable: true,
      cell: (row) => (
        <span className="font-semibold text-green-600">
          #{row.order_id}
        </span>
      ),
    },
    {
      name: "Customer",
      selector: (row) => row.user_name,
      cell: (row) => (
        <div>
          <p className="font-medium">{row.user_name}</p>
          <p className="text-xs text-gray-500">{row.user_email}</p>
        </div>
      ),
    },
    {
      name: "Location",
      cell: (row) => {
        const ship = parseShipping(row.shipping_details);
        return (
          <div>
            <p>{ship.cityName}</p>
            <p className="text-xs text-gray-500">{ship.state}</p>
          </div>
        );
      },
    },
    {
      name: "Amount",
      selector: (row) => row.total_amount,
      sortable: true,
      cell: (row) => (
        <span className="font-semibold">₹{row.total_amount}</span>
      ),
    },
    {
      name: "Payment",
      selector: (row) => row.payment_method,
      cell: (row) => (
        <span className="text-blue-600 font-medium">
          {row.payment_method}
        </span>
      ),
    },
    {
      name: "Status",
      cell: (row) => (
        <select
          value={row.order_status}
          disabled={updatingId === row.order_id}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            updateOrderStatus(row.order_id, e.target.value)
          }
          className={`px-3 py-1 rounded-full text-sm border outline-none ${getStatusClass(
            row.order_status
          )}`}
        >
          {STATUSES.filter((s) => s !== "All").map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: "Date",
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  /* ---------------- SEARCH ---------------- */
  const filteredOrders = orders.filter((order) =>
    `${order.order_id} ${order.user_name} ${order.user_email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* NAVBAR */}
      <div className="bg-[#F5F5F5] text-[16px] rounded-full shadow p-4 mb-6">
        <div className="bg-[#F5F5F5] p-5 rounded-full flex gap-3 flex-wrap">
          {STATUSES.map((status) => (
            <div className="w-[100px]">
              <button
              key={status}
              onClick={() => fetchOrders(status)}
              className={`px-5 py-2 rounded-full
                ${
                  activeStatus === status
                    ? "bg-[#A3C526] text-white"
                    : "text-gray-700"
                }`}
            >
              {status}
            </button>
            </div>
          ))}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="bg-white rounded-xl shadow p-4 flex justify-between mb-6">
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[5, 10, 20].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm w-64"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredOrders}
          progressPending={loading}
          pagination
          paginationPerPage={rowsPerPage}
          highlightOnHover
          striped
          pointerOnHover
          onRowClicked={(row) =>
            router.push(`/dashboard/order-details/${row.order_id}`)
          }
          noDataComponent="No orders found"
        />
      </div>
    </div>
  );
}
