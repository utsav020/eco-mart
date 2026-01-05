"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Printer,
  Download,
  Mail,
  Home,
  Package,
  CreditCard,
  User,
  Calendar,
  ShoppingBag,
  MapPin,
  Phone,
  FileText,
  ChevronRight,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
} from "lucide-react";

interface OrderItem {
  productName: string;
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

  /* FETCH ORDER */
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

  /* PRINT */
  const handlePrint = () => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
    const original = document.body.innerHTML;
    const printStyles = `
      <style>
        @media print {
          @page {
            margin: 20mm;
          }
          body {
            font-family: 'Inter', sans-serif;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    `;

    document.body.innerHTML = printStyles + printContent;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium text-lg">
            Loading invoice...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Please wait while we fetch your order details
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="relative">
            <div className="w-20 h-20 bg-linear-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Invoice Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't find the requested invoice. It may have been moved or
            deleted.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const shipping: ShippingDetails = JSON.parse(order.shipping_details || "{}");
  const subTotal = order.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Number(order.total_amount) - subTotal;

  const getStatusConfig = (status: string) => {
    const config = {
      completed: {
        color: "from-emerald-500 to-green-600",
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        icon: CheckCircle,
        iconColor: "text-emerald-600",
      },
      pending: {
        color: "from-amber-500 to-yellow-600",
        bg: "bg-amber-50",
        text: "text-amber-800",
        icon: Clock,
        iconColor: "text-amber-600",
      },
      processing: {
        color: "from-blue-500 to-indigo-600",
        bg: "bg-blue-50",
        text: "text-blue-800",
        icon: Clock,
        iconColor: "text-blue-600",
      },
      shipped: {
        color: "from-purple-500 to-violet-600",
        bg: "bg-purple-50",
        text: "text-purple-800",
        icon: Truck,
        iconColor: "text-purple-600",
      },
      cancelled: {
        color: "from-red-500 to-rose-600",
        bg: "bg-red-50",
        text: "text-red-800",
        icon: XCircle,
        iconColor: "text-red-600",
      },
    };

    return (
      config[status.toLowerCase() as keyof typeof config] || config.pending
    );
  };

  const statusConfig = getStatusConfig(order.order_status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-full ">
      {/* Header Navigation */}
      <div className="bg-white backdrop-blur-sm border-b border-gray-100 md:rounded-full sticky top-0 z-10">
        <div className="max-w-auto mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="">
                <button
                  onClick={() => window.history.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-500 rotate-180" />
                </button>
              </div>
              <div>
                <div className="h-[50px] w-[200px]">
                  <div className="text-[16px] font-bold bg-linear-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Order Invoice
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gray-500 text-[12px]">
                      #{order.order_id}
                    </span>
                    {/* <span className="text-gray-300">•</span> */}
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      <StatusIcon
                        className={`h-3.5 w-3.5 ${statusConfig.iconColor}`}
                      />
                      {order.order_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium border border-gray-200 shadow-sm hover:shadow">
                <Mail size={18} />
                Email
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium border border-gray-200 shadow-sm hover:shadow">
                <Download size={18} />
                PDF
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                <Printer size={18} />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Invoice Container */}
      <div className="max-w-auto h-full mx-auto px-4 py-8">
        <div
          ref={printRef}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Decorative Header */}
          <div className={`relative h-2 bg-linear-to-r ${statusConfig.color}`}></div>

          {/* Invoice Header */}
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start lg:items-center gap-8">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`relative w-16 h-16 bg-linear-to-br ${statusConfig.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <ShoppingBag className="h-8 w-8 text-white" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold text-gray-800">
                        INV
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      Invoice
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500">
                        #INV-{order.order_id.toString().padStart(6, "0")}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="space-y-4">
                  <div>
                    <div className="text-[20px] mb- font-bold text-gray-900">
                      Ekomart Store
                    </div>
                    <p className="text-gray-600">
                      Premium E-commerce Solutions
                    </p>
                  </div>
                  <div className="gap-4">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Phone size={16} />
                      +91 98765 43210
                    </span>
                    <span className="flex items-center gap-2 mt-1 text-gray-500">
                      <Mail size={16} />
                      support@ekomart.com
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:text-right">
                <div className="inline-flex flex-col md:items-end gap-1">
                  <div className="text-3xl text-black font-semibold bg-clip-text">
                    #{order.order_id}
                  </div>
                  <div className="text-[12px] text-gray-500 uppercase tracking-wider font-semibold">
                    Order Number
                  </div>
                  <div className="mt-4 flex items-center gap-2 md:justify-end">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      {order.payment_method}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Order Info */}
          <div className="px-8 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Card */}
              <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Customer Details
                    </h3>
                    <p className="text-sm text-gray-500">Invoice issued to</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {order.user_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-gray-700">{order.user_email}</div>
                  </div>
                  {shipping.phone && (
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="text-gray-700">{shipping.phone}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status Card */}
              <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 ${statusConfig.bg} rounded-xl flex items-center justify-center`}
                  >
                    <StatusIcon
                      className={`h-6 w-6 ${statusConfig.iconColor}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Order Status</h3>
                    <p className="text-sm text-gray-500">
                      Current order status
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Status</span>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      {order.order_status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">
                      ₹{Number(order.total_amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Items</span>
                    <span className="text-gray-900 font-medium">
                      {order.items?.length || 0} items
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="px-8 md:px-10 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Billing Address */}
              <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="font-bold text-[18px] text-gray-900">Billing Address</div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900">
                    {shipping.firstName} {shipping.lastName}
                  </p>
                  <p className="text-gray-600">{shipping.address}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>{shipping.cityName}</span>
                    <span className="text-gray-300">•</span>
                    <span>{shipping.state}</span>
                    <span className="text-gray-300">•</span>
                    <span>{shipping.pinCode}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-green-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-linear-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Home className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="font-bold text-[18px] text-gray-900">Shipping Address</div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900">
                    {shipping.firstName} {shipping.lastName}
                  </p>
                  <p className="text-gray-600">{shipping.address}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>{shipping.cityName}</span>
                    <span className="text-gray-300">•</span>
                    <span>{shipping.state}</span>
                    <span className="text-gray-300">•</span>
                    <span>{shipping.pinCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="px-8 md:px-10 mt-8">
            <div className="bg-linear-to-br from-gray-50 to-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="font-bold text-gray-900">
                  Order Summary
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Details of purchased items
                </p>
              </div>

              {/* Desktop Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-left py-4 px-6 text-[12px] font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-gray-400" />
                          Product
                        </div>
                      </th>
                      <th className="text-right py-4 px-6 text-[12px] font-semibold text-gray-700 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="text-center py-4 px-6 text-[12px] font-semibold text-gray-700 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="text-right py-4 px-6 text-[12px] font-semibold text-gray-700 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items?.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {item.productName || item.product_name}
                              </p>
                              {/* <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">SKU: {(item.productName || item.product_name).substring(0, 6).toUpperCase()}</span>
                                <span className="text-xs text-gray-500">#{idx + 1}</span>
                              </div> */}
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="text-[14px] font-semibold text-gray-900">
                            ₹{item.price}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center">
                          <div className="inline-flex items-center justify-center min-w-16 h-10 bg-linear-to-br from-gray-50 to-white rounded-lg font-semibold border border-gray-200">
                            {item.quantity}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="text-[14px] font-bold text-gray-900">
                            ₹{item.price * item.quantity}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Total Amount Section */}
          <div className="px-8 md:px-10 mt-8 pb-10">
            <div className="flex justify-end">
              <div className="w-full lg:w-1/3">
                <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">
                    Amount Summary
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{subTotal.toLocaleString()}
                      </span>
                    </div>

                    {tax > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tax (GST)</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{tax}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping & Handling</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ₹0.00
                      </span>
                    </div>

                    <div className="border-t border-gray-300 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            Total Amount
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            Inclusive of all taxes
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black bg-linear-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                            ₹{Number(order.total_amount).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Payment via {order.payment_method}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
