"use client";

import React from "react";

export default function SummaryItemCard({ item }: any) {
  return (
    <div className="flex items-center gap-4 border-b pb-4">
      {/* IMAGE */}
      <img
        src={item.image_url}
        alt={item.productName}
        className="w-20 h-20 object-cover rounded-lg border"
      />

      {/* DETAILS */}
      <div className="flex-1">
        <h2 className="font-semibold text-gray-800">{item.productName}</h2>

        {item.productVariantName && (
          <p className="text-sm text-gray-500">{item.productVariantName}</p>
        )}

        <div className="mt-2 flex justify-between text-sm">
          <span className="text-gray-600">Qty: {item.quantity}</span>
          <span className="font-semibold text-gray-900">₹{item.price}</span>
        </div>
      </div>
    </div>
  );
}
