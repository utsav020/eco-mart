"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/components/header/CartContext";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const { cartItems } = useCart(); // ALL CART ITEMS
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [userId, setUserId] = useState<string | null>(null);

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
  const [loading, setLoading] = useState(false);

  /* ---------------- Load user_id from localStorage ---------------- */
  useEffect(() => {
    const uid = localStorage.getItem("user_id");
    setUserId(uid);
  }, []);

  /* ---------------- Card Type Detect ---------------- */
  const detectCardType = (num: string) => {
    const n = num.replace(/\s+/g, "");
    if (/^4/.test(n)) return "visa";
    if (/^5[1-5]/.test(n)) return "mastercard";
    if (/^3[47]/.test(n)) return "amex";
    if (/^6/.test(n)) return "discover";
    return "";
  };

  /* ---------------- Luhn Algorithm ---------------- */
  const luhnCheck = (num: string) => {
    const digits = num.replace(/\s+/g, "");
    let sum = 0,
      dbl = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let d = parseInt(digits[i]);
      if (dbl) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      dbl = !dbl;
    }
    return sum % 10 === 0;
  };

  /* ---------------- Input Handlers ---------------- */
  const handleCardNumberChange = (e: any) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = val.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    setCardType(detectCardType(formatted));
    setErrors((s) => ({ ...s, cardNumber: "" }));
  };

  const handleExpiryChange = (e: any) => {
    let v = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    setExpiry(v);
    setErrors((s) => ({ ...s, expiry: "" }));
  };

  const handleCvvChange = (e: any) => {
    const max = cardType === "amex" ? 4 : 3;
    setCvv(e.target.value.replace(/\D/g, "").substring(0, max));
    setErrors((s) => ({ ...s, cvv: "" }));
  };

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setBillingInfo({ ...billingInfo, [id]: value });
    setErrors((s) => ({ ...s, [id]: "" }));
  };

  /* ---------------- Valid Expiry ---------------- */
  const validateExpiry = (v: string) => {
    if (!/^\d{2}\/\d{2}$/.test(v)) return false;
    const [mm, yy] = v.split("/").map(Number);
    const now = new Date();

    if (mm < 1 || mm > 12) return false;

    const cy = now.getFullYear() % 100;
    const cm = now.getMonth() + 1;

    return !(yy < cy || (yy === cy && mm < cm));
  };

  /* ---------------- Submit Order to Backend ---------------- */
  const handleOrderSubmit = async (e: any) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Billing validation
    ["firstName", "lastName", "email", "address"].forEach((f) => {
      if (!billingInfo[f as keyof Billing]) newErrors[f] = "Required";
    });

    // Card validation
    if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\s+/g, "");

      if (!luhnCheck(digits)) newErrors.cardNumber = "Invalid card number";
      if (!validateExpiry(expiry)) newErrors.expiry = "Invalid expiry";
      if (cvv.length !== (cardType === "amex" ? 4 : 3))
        newErrors.cvv = "Invalid CVV";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!userId) {
      alert("User not logged in");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://ekomart-backend.onrender.com/api/cart/checkoutcart",
        {
          user_id: userId,
          payment_method: paymentMethod === "cod" ? "COD" : "CARD",
          billing: billingInfo,
          items: cartItems,
        }
      );

      console.log("ORDER SUCCESS:", response.data);

      localStorage.setItem("lastOrder", JSON.stringify(response.data));
      router.push("/order-success");

      setLoading(false);
    } catch (error: any) {
      console.log("Checkout Error", error);
      alert("Checkout failed. Try again.");
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-[640px]">

        <form onSubmit={handleOrderSubmit} className="space-y-8">

          {/* Billing Address */}
          <div className="shadow p-6 bg-white rounded-md">
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="firstName" label="First Name" value={billingInfo.firstName} onChange={handleInputChange} error={errors.firstName} />
              <Input id="lastName" label="Last Name" value={billingInfo.lastName} onChange={handleInputChange} error={errors.lastName} />
            </div>

            <Input id="email" label="Email Address" value={billingInfo.email} onChange={handleInputChange} error={errors.email} />
            <Input id="address" label="Street Address" value={billingInfo.address} onChange={handleInputChange} error={errors.address} />
            <Input id="city" label="City" value={billingInfo.city} onChange={handleInputChange} />
            <Input id="state" label="State" value={billingInfo.state} onChange={handleInputChange} />
            <Input id="zip" label="Zip Code" value={billingInfo.zip} onChange={handleInputChange} />
            <Input id="phone" label="Phone Number" value={billingInfo.phone} onChange={handleInputChange} />
          </div>

          {/* Payment Section */}
          <div className="shadow p-6 bg-white rounded-md">
            <h3 className="text-lg font-semibold">Payment Method</h3>

            {/* COD */}
            <div className="mt-4 flex items-center gap-3 border p-3 rounded-md">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>Cash on Delivery (COD)</span>
            </div>

            {/* CARD */}
            <div className="mt-4 border p-4 rounded-md">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <span>Pay with Credit / Debit Card</span>
              </div>

              {paymentMethod === "card" && (
                <>
                  <Input id="cardNumber" label="Card Number" value={cardNumber} onChange={handleCardNumberChange} error={errors.cardNumber} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="expiry" label="Expiry (MM/YY)" value={expiry} onChange={handleExpiryChange} error={errors.expiry} />
                    <Input id="cvv" label="CVV" value={cvv} onChange={handleCvvChange} error={errors.cvv} />
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-md text-lg font-semibold"
          >
            {loading ? "Processing..." : "Complete Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Reusable Input Component ---------------- */
function Input({ id, label, value, onChange, error }: any) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full h-11 px-3 border rounded-md ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
