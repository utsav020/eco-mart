"use client";

import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { OrderDetails } from "@/lib/types";
import { useParams } from "next/navigation";
import {
  Calendar,
  Package,
  Truck,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Hash,
  Scale,
  Package2,
  ChevronRight,
  Home,
  FileText,
  Tag,
} from "lucide-react";
import HeaderThree from "@/components/header/HeaderThree";
import Link from "next/link";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [detail, setDetail] = useState<OrderDetails | null>(null);
  const [shipping, setShipping] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await apiGet(`/api/user/orderdetails/${orderId}`);
        console.log("ORDER DETAILS API RESPONSE:", data);

        const orderData = data.order || null;

        let parsedShipping = null;
        if (orderData?.shipping_details) {
          try {
            parsedShipping = JSON.parse(orderData.shipping_details);
          } catch (err) {
            console.error("Error parsing shipping details:", err);
          }
        }

        setDetail(orderData);
        setShipping(parsedShipping);
      } catch (err) {
        console.error("Error loading order details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [orderId]);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "cancelled":
      case "failed":
        return <XCircle className="w-5 h-5" />;
      case "processing":
      case "shipped":
        return <Package className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusStep = (status: string) => {
    const statusLower = status.toLowerCase();
    const steps = [
      { key: "pending", label: "Order Placed", icon: Clock },
      { key: "processing", label: "Processing", icon: Package },
      { key: "shipped", label: "Shipped", icon: Truck },
      { key: "delivered", label: "Delivered", icon: CheckCircle },
    ];

    const currentIndex = steps.findIndex(step => 
      statusLower.includes(step.key)
    );

    return { steps, currentIndex: currentIndex >= 0 ? currentIndex : 0 };
  };

  const { steps, currentIndex } = getStatusStep(detail?.order_status || "");

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Loading order details</p>
            <p className="text-sm text-gray-500">Please wait while we fetch your order information</p>
          </div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-100 rounded-full">
            <AlertCircle className="w-10 h-10 text-rose-600" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
            <p className="text-gray-600">We couldn't find any details for this order.</p>
          </div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const items = Array.isArray(detail.items) ? detail.items : [];
  const totalItems = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <HeaderThree />
      
      {/* Main Content */}
      <main className="pt-[140px] pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li>
                <Link href="/orders" className="hover:text-blue-600 transition-colors">
                  Orders
                </Link>
              </li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li className="font-medium text-gray-900">Order #{orderId}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{orderId}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(detail.order_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(detail.order_status)}`}>
                  {getStatusIcon(detail.order_status)}
                  <span className="font-semibold capitalize">
                    {detail.order_status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">₹{detail.total_amount}</p>
                  <p className="text-sm text-gray-600">{totalItems} items</p>
                </div>
              </div>
            </div>

            {/* Order Progress Steps */}
            <div className="mt-8 pt-8 border-t">
              <div className="relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200"></div>
                <div className="absolute top-4 left-0 h-0.5 bg-blue-600 transition-all duration-300"
                  style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}>
                </div>
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-medium ${
                          isCompleted ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Items Card */}
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order Items ({items.length})
                    </h2>
                  </div>
                </div>

                <div className="divide-y">
                  {items.length === 0 ? (
                    <div className="p-8 text-center">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No items found in this order</p>
                    </div>
                  ) : (
                    items.map((item, idx) => (
                      <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-4">
                          {/* Product Image Placeholder */}
                          <div className="shrink-0 w-20 h-20 bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-blue-400" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <h3 className="font-medium text-gray-900 line-clamp-2">
                                  {item.productName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {item.categoryName}
                                </p>
                                {item.productVariantName && (
                                  <div className="inline-flex items-center gap-1 mt-1">
                                    <Tag className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">{item.productVariantName}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                  ₹{item.subtotal}
                                </p>
                                <p className="text-sm text-gray-600">
                                  ₹{item.price} × {item.quantity}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                              {item.weights && (
                                <div className="flex items-center gap-1">
                                  <Scale className="w-4 h-4" />
                                  <span>{item.weights}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Regular:</span>
                                <span className="font-medium">₹{item.regularPrice}</span>
                              </div>
                              
                              {item.salePrice && item.salePrice !== "0" && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">Sale:</span>
                                  <span className="font-medium text-emerald-600">
                                    ₹{item.salePrice}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Customer Information (Optional) */}
              {detail.user && (
                <div className="bg-white rounded-2xl shadow-sm border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Customer Information
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email Address</p>
                          <p className="font-medium text-gray-900">{detail.user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="font-medium text-gray-900">{detail.user.phoneNo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order & Shipping Info */}
            <div className="space-y-8">
              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Items Total</span>
                    <span className="font-medium">
                      ₹{items.reduce((sum, item) => sum + parseFloat(String(item.subtotal || 0)), 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{detail.payment_method}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Items</span>
                    <div className="flex items-center gap-2">
                      <Package2 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{totalItems} items</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ₹{detail.total_amount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Details Card */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Shipping Details
                  </h2>
                </div>

                {!shipping ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                      <Truck className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No shipping details available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Recipient Name</p>
                          <p className="font-medium text-gray-900">{shipping.firstName} {shipping.lastName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="font-medium text-gray-900">{shipping.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Shipping Address</p>
                          <p className="font-medium text-gray-900">{shipping.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Shipping Fields */}
                    {Object.entries(shipping).some(([key]) => !["name", "address", "phone"].includes(key)) && (
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-gray-900 mb-3">Additional Details</p>
                        <div className="space-y-2">
                          {Object.entries(shipping).map(([key, value]) => {
                            if (["name", "address", "phone"].includes(key)) return null;
                            return (
                              <div key={key} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 capitalize">
                                  {key.replace(/_/g, " ")}
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {String(value)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order ID Card */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg">
                    <Hash className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Order Reference</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Keep this ID for tracking and support</p>
                <div className="bg-white rounded-lg p-3 border">
                  <code className="font-mono font-bold text-gray-900 text-sm">
                    {orderId}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}