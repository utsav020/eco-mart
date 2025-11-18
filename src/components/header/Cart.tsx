"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { X } from "lucide-react";

interface CartItem {
  regularPrice: any;
  productImage: string;
  id: number;
  image: string;
  title: string;
  productName: string;
  price: number;
  quantity: number;
  active: boolean; // true = cart, false = wishlist
}

const CartDropdown: React.FC = () => {
  const { cartItems, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeItems = cartItems.filter((item: CartItem) => item.active);
  const total = activeItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );
  const freeShippingThreshold = 125;
  const remaining = freeShippingThreshold - total;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Button */}
      <button
        className="flex items-center cursor-pointer p-2 hover:opacity-80"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle cart dropdown"
      >
        <img
          src="/assets/images/navbar/Bag.png"
          alt="Cart"
          className="w-10 h-10"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 h-200 w-180 bg-white shadow-xl rounded-lg p-4 z-50 border border-gray-200">
          {/* Close Button */}
          <div className="flex items-center justify-between">
            <div className="">
              <h5 className="text-base font-semibold border-b border-gray-200 pb-2 mb-3">
                Shopping Cart ({activeItems.length.toString().padStart(2, "0")})
              </h5>
            </div>

            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-red-500 transition text-[16px]"
                aria-label="Close cart"
              >
                &times;
              </button>
            </div>
          </div>
          {/* Empty Cart */}
          {activeItems.length === 0 ? (
            <p className="text-gray-500 text-[16px] text-center py-3">
              Your cart is empty
            </p>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {activeItems.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="border-t border-gray-100 pt-3 flex items-start justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label="Remove item"
                      >
                        {/* <i className="fa-regular fa-x"></i> */}
                        <X className="text-[15px]" />
                      </button>

                      {/* Image */}
                      <div className="w-[60px] h-[60px] flex-shrink-0">
                        <img
                          src={"/assets/images/products/Oats.png"}
                          alt={item.title}
                          width={60}
                          height={60}
                          className="rounded-md object-cover w-full h-full"
                        />
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <Link
                          href="/shop/details-profitable-business-makes-your-profit"
                          className="hover:text-indigo-600"
                        >
                          <h5 className="text-[16px] font-medium truncate text-gray-800 w-[150px]">
                            {item.title}
                          </h5>
                        </Link>
                        <div className="text-[16px] text-gray-600 flex items-center gap-1">
                          {item.quantity} <i className="fa-regular fa-x" />
                          <span>${Number(item.price || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal and Progress */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 text-[16px] font-medium">
                    Sub Total:
                  </span>
                  <span className="text-gray-900 text-[16px] font-semibold">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-green-500 h-2 transition-all duration-300"
                    role="progressbar"
                    style={{
                      width: `${Math.min(
                        (total / freeShippingThreshold) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                {/* Free Shipping Notice */}
                {total < freeShippingThreshold ? (
                  <p className="text-[16px] text-gray-600">
                    Spend more{" "}
                    <span className="font-semibold text-green-600">
                      ${remaining.toFixed(2)}
                    </span>{" "}
                    to reach{" "}
                    <span className="font-semibold">Free Shipping</span>
                  </p>
                ) : (
                  <p className="text-[16px] text-green-600 font-medium">
                    🎉 You’ve unlocked free shipping!
                  </p>
                )}

                {/* Buttons */}
                <div className="flex items-center justify-between gap-3 mt-4">
                  <Link
                    href="/cart"
                    className="w-1/2 text-center py-2 text-[16px] rounded-md bg-green-500 text-white transition"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="w-1/2 text-center text-black py-2 text-[16px] rounded-md border transition"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
