"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ApexChartOne from "./ApexChartOne";
import ApexChartTwo from "./ApexChartTwo";
import TopProductCountries from "./TopProductCountries";
import OtherBestSeller from "./OtherBestSeller";

interface OrderSummary {
  total_orders: number;
  total_revenue: string;
  delivered_revenue: string;
  pending_orders: number;
  cancelled_orders: number;
  Shipped_orders: number;
}

const SUMMARY_API =
  "https://ekomart-backend.onrender.com/api/adminorder/orders-summary";

function DemoContent() {
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(SUMMARY_API);
        setSummary(res.data);
      } catch (error) {
        console.error("Failed to fetch order summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl md:text-2xl font-semibold text-[#1F2937]">
            Overview
          </h3>

          <div className="">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]">
            <option>Week</option>
            <option>Month</option>
            <option>Year</option>
            <option>6 Months</option>
          </select>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
          {/* Total Orders */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <p className="text-sm text-[#4F46E5]">Total Orders</p>
            <h1 className="text-2xl font-bold text-[#4F46E5] mt-2">
              {loading ? "--" : summary?.total_orders}
            </h1>
          </div>

          {/* Total Revenue */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-sm text-[#059669]">Total Revenue</p>
            <h1 className="text-2xl font-bold text-[#059669] mt-2">
              {loading ? "--" : `₹${summary?.total_revenue}`}
            </h1>
          </div>

          {/* Delivered Revenue */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <p className="text-sm text-[#16A34A]">Delivered Revenue</p>
            <h1 className="text-2xl font-bold text-[#16A34A] mt-2">
              {loading ? "--" : `₹${summary?.delivered_revenue}`}
            </h1>
          </div>

          {/* Pending Orders */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <p className="text-sm text-[#CA8A04]">Pending Orders</p>
            <h1 className="text-2xl font-bold text-[#CA8A04] mt-2">
              {loading ? "--" : summary?.pending_orders}
            </h1>
          </div>

          {/* Shipped Orders */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm text-[#3B82F6]">Shipped Orders</p>
            <h1 className="text-2xl font-bold text-[#3B82F6] mt-2">
              {loading ? "--" : summary?.Shipped_orders}
            </h1>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-sm text-[#DC2626]">Cancelled Orders</p>
            <h1 className="text-[16px] font-bold text-[#DC2626] mt-2">
              {loading ? "--" : summary?.cancelled_orders}
            </h1>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          <ApexChartOne />
          <ApexChartTwo />
          <TopProductCountries />
          <OtherBestSeller />
        </div>

        {/* FOOTER */}
        <div className="mt-10 py-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-sm text-[#4B5563]">
          <p>© 2025 All Rights Reserved.</p>
          <ul className="flex space-x-5 mt-3 sm:mt-0">
            <li><a href="#" className="hover:text-[#4F46E5]">Terms</a></li>
            <li><a href="#" className="hover:text-[#4F46E5]">Privacy</a></li>
            <li><a href="#" className="hover:text-[#4F46E5]">Help</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DemoContent;
