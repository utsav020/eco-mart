"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { 
  ShoppingCart, 
  Package, 
  Tag, 
  CreditCard, 
  Shield, 
  Truck,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import router from "next/router";

export default function CartSummaryPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [proceeding, setProceeding] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setError("Please login to view your cart summary");
      setLoading(false);
      return;
    }

    fetchSummary(token);
  }, []);

  const fetchSummary = async (token: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/cart/checkoutcart/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const summaryData = response?.data?.data ?? response?.data ?? null;

      if (!summaryData) {
        setError("No summary data found.");
        setLoading(false);
        return;
      }

      // Calculate totals
      const items = summaryData.items ?? [];
      const calculatedTotalItems = items.reduce(
        (acc: number, item: any) => acc + (item.quantity || 0),
        0
      );
      const calculatedTotalPrice = items.reduce(
        (acc: number, item: any) => acc + (item.price || 0) * (item.quantity || 0),
        0
      );

      const finalSummary = {
        items,
        totalItems: summaryData.totalItems ?? calculatedTotalItems,
        totalPrice: summaryData.totalPrice ?? calculatedTotalPrice,
        discount: summaryData.discount ?? 0,
        finalPrice:
          summaryData.finalPrice ??
          calculatedTotalPrice - (summaryData.discount ?? 0),
      };

      setSummary(finalSummary);
    } catch (error: any) {
      console.error("Summary error:", error);
      setError(error?.response?.data?.message || "Failed to load summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    setProceeding(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Redirecting to payment gateway...");
    setProceeding(false);
    router.push("/order-details");
  };

  const handleContinueShopping = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your order summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Checkout Summary</h1>
                <p className="text-gray-500">Review your order before payment</p>
              </div>
            </div>
            <button
              onClick={handleContinueShopping}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : summary ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items ({summary.totalItems})
                  </h2>
                  <span className="text-sm font-medium text-gray-500">
                    {summary.items?.length} unique items
                  </span>
                </div>

                <div className="space-y-4">
                  {summary.items && summary.items.length > 0 ? (
                    summary.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                      >
                        <div className="relative">
                          <img
                            src={item.image_url || "/api/placeholder/96/96"}
                            alt={item.productName}
                            className="w-24 h-24 object-cover rounded-lg border"
                          />
                          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {item.productName}
                              </h3>
                              {item.productVariantName && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Variant: {item.productVariantName}
                                </p>
                              )}
                              <p className="text-sm text-gray-500 mt-1">
                                Unit Price: ₹{item.price}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 text-lg">
                                ₹{(item.price * item.quantity)}
                              </p>
                              <p className="text-sm text-gray-500">
                                ₹{item.price} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No items found in your cart</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Why Shop With Us
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Payment</p>
                      <p className="text-sm text-gray-500">100% Secure</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Truck className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Fast Delivery</p>
                      <p className="text-sm text-gray-500">2-3 Business Days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-500">30 Day Policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        ₹{summary.totalPrice?.toFixed(2)}
                      </span>
                    </div>

                    {summary.discount > 0 && (
                      <div className="flex justify-between items-center pb-3 border-b">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-600" />
                          Discount
                        </span>
                        <span className="font-medium text-green-600">
                          - ₹{summary.discount?.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-900">₹0.00</span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{summary.finalPrice?.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <a href="/user-details">
                    <button
                    onClick={handleProceedToPayment}
                    disabled={proceeding}
                    className={`w-full mt-6 py-4 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                      proceeding
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {proceeding ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </button>
                  </a>

                  <p className="text-center text-xs text-gray-500 mt-3">
                    By completing your purchase, you agree to our Terms of Service
                  </p>
                </div>

                {/* Help Section */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Contact our 24/7 customer support for any queries.
                  </p>
                  <button className="w-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 py-2 rounded-lg font-medium transition-colors text-sm">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-8">
        <div className="text-center text-sm text-gray-500">
          <p>Prices and availability are subject to change. All prices are in INR.</p>
          <p className="mt-1">© {new Date().getFullYear()} Your Store. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}