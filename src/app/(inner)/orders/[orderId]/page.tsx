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
  Package2
} from "lucide-react";
import HeaderThree from "@/components/header/HeaderThree";

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
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Order Not Found</h2>
          <p className="text-gray-500">No details found for this order.</p>
        </div>
      </div>
    );
  }

  const items = Array.isArray(detail.items) ? detail.items : [];

  return (
    <div className="min-h-screen bg-white mt-[140px] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1430px] w-full mx-auto">
        <HeaderThree />

        {/* Header */}
        <div className="mb-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order ID: {orderId}</p>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(detail.order_status)}`}>
              {getStatusIcon(detail.order_status)}
              <span className="font-semibold capitalize">{detail.order_status}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>{new Date(detail.order_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order & Shipping Info */}
          <div className="lg:col-span-2  space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium">{detail.payment_method}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-green-600">₹{detail.total_amount}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Package2 className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Items</p>
                      <p className="font-medium">{items.length} items</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-medium font-mono">{orderId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Details Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Shipping Details</h2>
              </div>

              {!shipping ? (
                <div className="text-center py-8">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No shipping details available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Recipient Name</p>
                        <p className="font-medium">{shipping.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium">{shipping.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Shipping Address</p>
                        <p className="font-medium">{shipping.address}</p>
                      </div>
                    </div>
                    
                    {/* Extra shipping fields */}
                    {Object.entries(shipping).map(([key, value]) => {
                      if (["name", "address", "phone"].includes(key)) return null;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <div className="w-5 h-5" />
                          <div>
                            <p className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
                            <p className="font-medium">{String(value)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-medium">{detail.user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium">{detail.user.phoneNo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Items */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Order Items ({items.length})</h2>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No items found in this order</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 line-clamp-2">{item.productName}</p>
                          <p className="text-sm text-gray-500 mt-1">{item.categoryName}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-green-600">₹{item.price}</p>
                          <p className="text-sm text-gray-500">x {item.quantity}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Subtotal:</span>
                          <span className="font-medium">₹{item.subtotal}</span>
                        </div>
                        
                        {item.productVariantName && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Variant:</span>
                            <span className="font-medium">{item.productVariantName}</span>
                          </div>
                        )}
                        
                        {item.weights && (
                          <div className="flex items-center gap-2">
                            <Scale className="w-4 h-4" />
                            <span>{item.weights}</span>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                          <div>
                            <span className="text-gray-500">Regular:</span>
                            <span className="ml-2 font-medium">₹{item.regularPrice}</span>
                          </div>
                          {item.salePrice && item.salePrice !== "0" && (
                            <div>
                              <span className="text-gray-500">Sale:</span>
                              <span className="ml-2 font-medium text-red-600">₹{item.salePrice}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Total Summary */}
                  <div className="border-t pt-4 mt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Items Total</span>
                        <span className="font-medium">₹{items.reduce((sum, item) => sum + parseFloat(String(item.subtotal || 0)), 0)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                        <span>Total Amount</span>
                        <span className="text-green-600">₹{detail.total_amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}