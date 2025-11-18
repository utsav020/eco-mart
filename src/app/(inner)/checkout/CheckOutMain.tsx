"use client";
import React, { useState } from "react";
import { useCart } from "@/components/header/CartContext";

type Billing = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

export default function CheckOutMain() {
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingInfo, setBillingInfo] = useState<Billing>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s+/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6/.test(cleaned)) return "discover";
    return "";
  };

  // Luhn check for basic card validity
  const luhnCheck = (num: string) => {
    const digits = num.replace(/\s+/g, "");
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // formatted input for card number: groups of 4
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // only digits
    // limit digits based on likely card type: AMEX 15 others 16 (but allow up to 16)
    value = value.substring(0, 16);
    const formatted = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    setCardType(detectCardType(formatted));
    // clear cvv error if changing card type/number
    setErrors((s) => ({ ...s, cardNumber: "", cvv: "" }));
  };

  // expiry formatted as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4); // MMYY
    if (value.length >= 3) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setExpiry(value);
    setErrors((s) => ({ ...s, expiry: "" }));
  };

  // cvv length depends on card type (Amex 4, others 3)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    const max = cardType === "amex" ? 4 : 3;
    digits = digits.substring(0, max);
    setCvv(digits);
    setErrors((s) => ({ ...s, cvv: "" }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setBillingInfo({ ...billingInfo, [id]: value });
    setErrors((s) => ({ ...s, [id]: "" }));
  };

  const validateExpiry = (v: string) => {
    // expects "MM/YY"
    if (!/^\d{2}\/\d{2}$/.test(v)) return false;
    const [mmStr, yyStr] = v.split("/");
    const mm = parseInt(mmStr, 10);
    const yy = parseInt(yyStr, 10);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (yy < currentYear) return false;
    if (yy === currentYear && mm < currentMonth) return false;
    return true;
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Basic billing validation
    if (!billingInfo.firstName) newErrors.firstName = "First name is required";
    if (!billingInfo.lastName) newErrors.lastName = "Last name is required";
    if (!billingInfo.email) newErrors.email = "Email is required";
    if (!billingInfo.address) newErrors.address = "Address is required";

    if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\s+/g, "");
      // card number length: Amex 15, others typically 16
      if (!digits) newErrors.cardNumber = "Card number is required";
      else {
        if (cardType === "amex") {
          if (digits.length !== 15)
            newErrors.cardNumber = "AMEX number must be 15 digits";
        } else if (digits.length < 13 || digits.length > 16) {
          newErrors.cardNumber = "Card number must be 13–16 digits";
        }
        if (!luhnCheck(digits))
          newErrors.cardNumber = newErrors.cardNumber
            ? newErrors.cardNumber
            : "Invalid card number";
      }

      if (!expiry) newErrors.expiry = "Expiration is required";
      else if (!validateExpiry(expiry))
        newErrors.expiry = "Invalid expiration date";

      const cvvLen = cardType === "amex" ? 4 : 3;
      if (!cvv) newErrors.cvv = "Security code is required";
      else if (cvv.length !== cvvLen)
        newErrors.cvv = `CVV must be ${cvvLen} digits`;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // All good — here you would call your payment API / process order
      alert(
        `Order completed successfully! Payment: ${
          paymentMethod === "cod"
            ? "Cash on Delivery"
            : "Card (" + (cardType || "unknown") + ")"
        }`
      );
      // reset some fields if desired
    } else {
      // scroll to first error if desired (simple focus)
      const firstKey = Object.keys(newErrors)[0];
      const el = document.getElementById(firstKey);
      if (el) el.focus();
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center  ">
      <div className="w-full max-w-[640px] rounded-lg">
        <form onSubmit={handleOrderSubmit} className="space-y-8">
          {/* Billing Address */}
          <div className="bg-white rounded-[4px] shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Billing Address
            </h2>
            {/* NAME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-[12px] font-medium text-gray-700">
                  First Name
                </label>
                <div className="h-[44px] border border-[#B2BCCA] rounded-[4px]">
                  <input
                    id="firstName"
                    type="text"
                    value={billingInfo.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 focus:ring-2 outline-none ${
                      errors.firstName
                        ? "border-red-400 focus:ring-red-200"
                        : "border-[#B2BCCA] focus:ring-blue-500"
                    }`}
                    placeholder="Alex"
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700">
                  Last Name
                </label>
                <div className="h-[44px] border border-[#B2BCCA] rounded-[4px]">
                  <input
                    id="lastName"
                    type="text"
                    value={billingInfo.lastName}
                    onChange={handleInputChange}
                    className={`w-full h-[44px] px-3 py-2 focus:ring-2 outline-none ${
                      errors.lastName
                        ? "border-red-400 focus:ring-red-200"
                        : "border-[#B2BCCA] focus:ring-blue-500"
                    }`}
                    placeholder="Driver"
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>

              {/* MAIL */}
            <div className="mt-4">
              <label className="block text-[12px] font-medium text-gray-700">
                Email Address
              </label>
              <div className="h-[44px] border border-[#B2BCCA] rounded-[4px]">
                <input
                  id="email"
                  type="email"
                  value={billingInfo.email}
                  onChange={handleInputChange}
                  className={`w-full h-[44px] px-3 py-2 focus:ring-2 outline-none ${
                    errors.email
                      ? "border-red-400 focus:ring-red-200"
                      : "border-[#B2BCCA] focus:ring-blue-500"
                  }`}
                  placeholder="username@gmail.com"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* ADDRESS */}
            <div className="mt-4">
              <label className="block text-[12px] font-medium text-gray-700">
                Street Address
              </label>
              <div className="h-[44px] border border-[#B2BCCA] rounded-[4px]">
                <input
                id="address"
                type="text"
                value={billingInfo.address}
                onChange={handleInputChange}
                className={`w-full h-[44px] px-3 py-2 focus:ring-2 outline-none ${
                  errors.address
                    ? "border-red-400 focus:ring-red-200"
                    : "border-[#B2BCCA] focus:ring-blue-500"
                }`}
                placeholder="123 Street Name"
                required
              />
              </div>
              <div className="h-[44px] mt-[15px] border border-[#B2BCCA] rounded-[4px]"></div>
              
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

              {/* STATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[12px] font-medium text-gray-700">
                  State/Province
                </label>
                <div className="h-[44px] border border-[#B2BCCA] rounded-[4px]">
                  <select
                    id="state"
                    value={billingInfo.state}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3 focus:ring-2 outline-none"
                  >
                    <option value="">Select State</option>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                    <option value="Texas">Texas</option>
                  </select>
                </div>
              </div>

              {/* CITY */}
              <div>
                <label className="block text-[12px] font-medium text-gray-700">
                  City
                </label>
                <div className="h-[44px] border border-[#B2BCCA] rounded-[4px]">
                  <input
                    id="city"
                    type="text"
                    value={billingInfo.city}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3 py-2 focus:ring-2 outline-none"
                    placeholder="San Diego"
                  />
                </div>
              </div>

              {/* ZIP/POSTAL CODE */}
              <div>
                <label className="block text-[12px] font-medium text-gray-700">
                  Zip/Postal Code
                </label>
                <div className="h-[44px] border border-[#B2BCCA] rounded-[4px]">
                  <input
                    id="zip"
                    type="text"
                    value={billingInfo.zip}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3 py-2 focus:ring-2 outline-none border-[#B2BCCA] focus:ring-blue-500"
                    placeholder="22434"
                  />
                </div>
              </div>

              {/* PHONE NO */}
              <div>
                <label className="block text-[12px] font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="h-[44px] border border-[#B2BCCA] rounded-[4px]">
                  <input
                    id="phone"
                    type="tel"
                    value={billingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full h-[44px] px-3 py-2 focus:ring-2 outline-none border-[#B2BCCA] focus:ring-blue-500"
                    placeholder="+123 456 789 111"
                  />
                </div>
              </div>
            </div>

            <div className="mt-[22px]">
              <div className="flex w-[316px] gap-[8px] items-center">
              <input
              type="checkbox"
              />

              <p className="text-[14px] text-[#4F4F4F]">My billing and shipping address are the same</p>
            </div>

            <div className="flex w-[316px] mt-[10px] gap-[8px] items-center">
              <input
              type="checkbox"
              />

              <p className="text-[14px] text-[#4F4F4F]">Create an account for later use</p>
            </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white border h-[395px] border-[#1660CF] rounded-md shadow-sm p-6">
            <div className="mt-[20px]">
              <p className="text-[16px] font-bold">Payment Method</p>
            </div>

            {/* COD */}
            <div className="w-[528px] h-[54px] mt-[29px] border border-[#B2BCCA] rounded-[4px]">
              <label className="flex w-[211px] mt-[12px] text-[16px] items-center gap-[8px] font-bold cursor-pointer ml-6">
                <div className="flex w-[211px] text-[16px] items-center gap-[8px] font-bold">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="form-radio text-blue-600 mr-2"
                  />

                  <div className="">
                    <p className="text-[16px] font-semibold text-gray-800">
                      Cash on Delivery (COD)
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* CREDIT CARD */}
            <div className="flex justify-between items-center mt-[15px] mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`block w-[528px] h-[220px] p-4 border rounded-md ${
                    paymentMethod === "card"
                      ? "border-[#1660CF] bg-[#1660CF]/10"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center w-[189px] gap-[8px]">
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

                  <div className="mt-[21px]">
                    {paymentMethod === "card" && (
                      <div className="gap-4">
                        <div className="flex w-[486px] h-[58px] items-center justify-between">
                          <div className="">
                            <label className="block text-[12px] font-medium text-gray-700">
                              Card number
                            </label>
                            <div className="w-[255px] h-[44px] border border-[#B2BCCA] rounded-[4px]">
                              <input
                                id="cardNumber"
                                type="text"
                                inputMode="numeric"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="1234 5678 9101 3456"
                                className={`w-full px-3 py-2 outline-none ${
                                  errors.cardNumber
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-[#B2BCCA] focus:ring-blue-500"
                                }`}
                                required
                              />
                              {cardType && (
                                <img
                                  src={`/assets/images/shop/${
                                    cardType === "visa"
                                      ? "Credit card3.png"
                                      : cardType === "mastercard"
                                      ? "Credit card2.png"
                                      : cardType === "amex"
                                      ? "Credit card1.png"
                                      : "Credit card.png"
                                  }`}
                                  alt="Card Type"
                                  className="absolute right-3 top-9 h-5"
                                />
                              )}
                              {errors.cardNumber && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.cardNumber}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="">
                            <label className="block text-[12px] font-medium text-gray-700">
                              Expiration Date
                            </label>
                            <div className="w-[213px] h-[44px] border border-[#B2BCCA] rounded-[4px]">
                              <input
                                id="expiry"
                                type="text"
                                inputMode="numeric"
                                value={expiry}
                                onChange={handleExpiryChange}
                                placeholder="MM/YY"
                                className={`w-full px-3 py-2 outline-none ${
                                  errors.expiry
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-[#B2BCCA] focus:ring-blue-500"
                                }`}
                                required
                              />
                              {errors.expiry && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.expiry}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="w-[349px] mt-[16px] flex justify-between items-center h-[58px]">
                          <div className="w-[255px]">
                            <label className="block text-[12px] font-medium text-gray-700">
                              Card Security Code
                            </label>
                            <div className="border border-[#B2BCCA] rounded-[4px] h-[44px]">
                              <input
                                id="cvv"
                                type="text"
                                inputMode="numeric"
                                value={cvv}
                                onChange={handleCvvChange}
                                placeholder={
                                  cardType === "amex" ? "4 digits" : "3 digits"
                                }
                                className={`w-full px-3 py-2 outline-none ${
                                  errors.cvv
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-[#B2BCCA] focus:ring-blue-500"
                                }`}
                                required
                              />
                              {errors.cvv && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.cvv}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-[20px]">
                            <a
                              href="#"
                              className="text-[12px] text-blue-600 underline mt-1 inline-block"
                            >
                              What is this?
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "cod" && (
                      <div className="text-sm text-gray-600">
                        You will pay in cash when the order is delivered.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="flex items-center gap-2">
                <img src="/assets/images/shop/Credit card3.png" alt="Visa" className="w-10 h-7" />
                <img src="/assets/images/shop/Credit card2.png" alt="MasterCard" className="w-10 h-7" />
                <img src="/assets/images/shop/Credit card1.png" alt="Amex" className="w-10 h-7" />
                <img src="/assets/images/shop/Credit card.png" alt="Discover" className="w-10 h-7" />
              </div> */}
          </div>

          {/* Submit */}
          <div className="w-full h-[51px] flex items-center text-[14px] bg-[#018F45]">
            <button
            type="submit"
            className="w-full text-white rounded-md font-medium transition"
          >
            Complete Order
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}
