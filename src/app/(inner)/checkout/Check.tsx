"use client";
import React, { useState } from "react";
import { useCart } from "@/components/header/CartContext";
import { CreditCard, Truck } from "lucide-react";

export default function CheckOutMain() {
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setBillingInfo({ ...billingInfo, [id]: value });
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Order completed successfully!");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[570px] rounded-lg">
        <form onSubmit={handleOrderSubmit} className="space-y-8">
          {/* Billing Address */}
          <div className="max-w-[570px] h-[567px] bg-white rounded-[4px] shadow-xl p-4 sm:p-6 lg:p-8">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Billing Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[12px] font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="h-[44px] text-[15px] border border-[#B2BCCA] rounded-[4px]">
                    <input
                      id="firstName"
                      type="text"
                      value={billingInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Alex"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="h-[44px] text-[15px] border border-[#B2BCCA] rounded-[4px]">
                    <input
                      id="lastName"
                      type="text"
                      value={billingInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Driver"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Mail */}
              <div className="mt-4">
                <label className="block text-[12px] font-medium text-gray-700">
                  Email Address
                </label>
                <div className="h-[44px] text-[15px] border border-[#B2BCCA] rounded-[4px]">
                  <input
                    id="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="username@gmail.com"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mt-4">
                <label className="block text-[12px] font-medium text-gray-700">
                  Street Address
                </label>
                <div className="h-[44px] text-[15px] border border-[#B2BCCA] rounded-[4px]">
                  <input
                    id="address"
                    type="text"
                    value={billingInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="123 Street Name"
                    required
                  />
                </div>
              </div>

              <div className="h-[44px] mt-[15px] text-[15px] border border-[#B2BCCA] rounded-[4px]"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* State */}
                <div>
                  <label className="block text-[12px] font-medium text-gray-700">
                    State/Province
                  </label>
                  <div className="h-[44px] text-[15px] border border-[#B2BCCA] rounded-[4px]">
                    <select
                      id="state"
                      value={billingInfo.state}
                      onChange={handleInputChange}
                      className="w-full h-[44px] text-[15px] px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      {/* <option value="">Select State</option> */}
                      <option value="California">California</option>
                      <option value="New York">New York</option>
                      <option value="Texas">Texas</option>
                    </select>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-[12px] font-medium text-gray-700">
                    City
                  </label>
                  <div className="h-[44px] text-[15px] flex items-center border border-[#B2BCCA] rounded-[4px]">
                    <input
                      id="city"
                      type="text"
                      value={billingInfo.city}
                      onChange={handleInputChange}
                      className="w-full  px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="San Diego"
                    />
                  </div>
                </div>

                {/* Zip/Postal Code */}
                <div>
                  <label className="block text-[12px] font-medium text-gray-700">
                    Zip/Postal Code
                  </label>
                  <div className="h-[44px] flex items-center text-[15px] border border-[#B2BCCA] rounded-[4px]">
                    <input
                      id="zip"
                      type="text"
                      value={billingInfo.zip}
                      onChange={handleInputChange}
                      className="w-full h-[44px] px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="22434"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="">
                  <label className="block text-[12px] font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="h-[44px] text-[15px] flex items-center border border-[#B2BCCA] rounded-[4px]">
                    <input
                      id="phone"
                      type="tel"
                      value={billingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="+123 456 789 111"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-green-600"
                  />
                  <span className="ml-2 text-[12px] text-gray-600">
                    My billing and shipping address are the same
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-green-600"
                  />
                  <span className="ml-2 text-[12px] text-gray-600">
                    Create an account for later use
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="max-w-[570px] h-[395px] bg-white rounded-[4px] shadow-xl p-4 sm:p-6 lg:p-8">
            {/* Payment Method */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Payment Method
              </h2>
              <div className="space-y-4">
                {/* COD */}
                <div className="">
                  <label
                    className={`p-4 border w-[528px] rounded-md cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    <div className="h-[20px] flex items-center gap-[8px]">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="form-radio text-green-600"
                      />
                      <p className="text-[16px] font-semibold">
                        Cash on Delivery (COD)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Card */}
                <div className="">
                  <label
                    className={`block p-4 border rounded-md ${
                      paymentMethod === "card"
                        ? "border-[#1660CF] bg-[#1660CF]/10"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center w-[189px] border-2 gap-[8px]">
                        <div className="">
                          <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                            className="form-radio text-green-600"
                          />
                        </div>

                        <div className="">
                          <p className="text-[16px] font-medium">
                            Pay with Credit Card
                          </p>
                        </div>
                      </div>
                      <div className="flex ml-auto w-[185px] h-[30px] justify-between">
                        <img
                          src="/assets/images/shop/Credit card3.png"
                          alt="Visa"
                          className="w-[42.5px] h-[30px]"
                        />
                        <img
                          src="/assets/images/shop/Credit card2.png"
                          alt="Mastercard"
                          className="w-[42.5px] h-[30px]"
                        />
                        <img
                          src="/assets/images/shop/Credit card1.png"
                          alt="Amex"
                          className="w-[42.5px] h-[30px]"
                        />
                        <img
                          src="/assets/images/shop/Credit card.png"
                          alt="Accepted Payments"
                          className="w-[42.5px] h-[30px]"
                        />
                      </div>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[12px] font-medium text-gray-700">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9101 3456"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-medium text-gray-700">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-medium text-gray-700">
                            Card Security Code
                          </label>
                          <input
                            type="text"
                            placeholder="CVV"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <a
                            href="#"
                            className="text-[12px] text-green-600 underline mt-7 inline-block"
                          >
                            What is this?
                          </a>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition"
            >
              Complete Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}