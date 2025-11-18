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

  /* ------------------ Card Type Detection ------------------ */
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s+/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6/.test(cleaned)) return "discover";
    return "";
  };

  /* ------------------ Luhn Algorithm ------------------ */
  const luhnCheck = (num: string) => {
    const digits = num.replace(/\s+/g, "");
    let sum = 0;
    let dbl = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let d = parseInt(digits[i], 10);
      if (dbl) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      dbl = !dbl;
    }

    return sum % 10 === 0;
  };

  /* ------------------ Card Input Formatting ------------------ */
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = val.replace(/(.{4})/g, "$1 ").trim();

    setCardNumber(formatted);
    setCardType(detectCardType(formatted));
    setErrors((s) => ({ ...s, cardNumber: "", cvv: "" }));
  };

  /* ------------------ Expiry Formatting ------------------ */
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setExpiry(value);
    setErrors((s) => ({ ...s, expiry: "" }));
  };

  /* ------------------ CVV Formatting ------------------ */
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    const max = cardType === "amex" ? 4 : 3;
    setCvv(digits.substring(0, max));
    setErrors((s) => ({ ...s, cvv: "" }));
  };

  /* ------------------ Billing Input Handler ------------------ */
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
    if (!/^\d{2}\/\d{2}$/.test(v)) return false;

    const [mm, yy] = v.split("/").map(Number);
    if (mm < 1 || mm > 12) return false;

    const now = new Date();
    const cm = now.getMonth() + 1;
    const cy = now.getFullYear() % 100;

    if (yy < cy) return false;
    if (yy === cy && mm < cm) return false;

    return true;
  };

  /* ------------------ On Submit ------------------ */
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!billingInfo.firstName) newErrors.firstName = "Required";
    if (!billingInfo.lastName) newErrors.lastName = "Required";
    if (!billingInfo.email) newErrors.email = "Required";
    if (!billingInfo.address) newErrors.address = "Required";

    if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\s+/g, "");

      if (!digits) {
        newErrors.cardNumber = "Card number required";
      } else {
        if (cardType === "amex" && digits.length !== 15)
          newErrors.cardNumber = "AMEX must be 15 digits";

        if (cardType !== "amex" && digits.length < 13)
          newErrors.cardNumber = "Invalid card number";

        if (!luhnCheck(digits))
          newErrors.cardNumber = "Invalid card number";
      }

      if (!expiry) newErrors.expiry = "Required";
      else if (!validateExpiry(expiry)) newErrors.expiry = "Invalid date";

      const cvvLen = cardType === "amex" ? 4 : 3;
      if (!cvv) newErrors.cvv = "Required";
      else if (cvv.length !== cvvLen)
        newErrors.cvv = `CVV must be ${cvvLen} digits`;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Order completed successfully!");
    }
  };

  /* ================================================================
     RESPONSIVE MOBILE (FULL-WIDTH CLEAN LAYOUT)
     ================================================================ */
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[640px] rounded-md">

        <form onSubmit={handleOrderSubmit} className="space-y-8 bg-transparent">

          {/* ------------------ Billing Address Box ------------------ */}
          <div className="shadow-md p-6 bg-white rounded-md">
            <h2 className="text-xl font-semibold mb-4">Billing Address</h2>

            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="firstName"
                label="First Name"
                value={billingInfo.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                placeholder="Alex"
              />

              <Input
                id="lastName"
                label="Last Name"
                value={billingInfo.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                placeholder="Driver"
              />
            </div>

            <Input
              id="email"
              label="Email Address"
              value={billingInfo.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="username@gmail.com"
            />

            <Input
              id="address"
              label="Street Address"
              value={billingInfo.address}
              onChange={handleInputChange}
              error={errors.address}
              placeholder="123 Street Name"
            />

            <Input
              id="city"
              label="City"
              value={billingInfo.city}
              onChange={handleInputChange}
              placeholder="San Diego"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                id="state"
                label="State/Province"
                value={billingInfo.state}
                onChange={handleInputChange}
                options={["California", "Texas", "New York"]}
              />

              <Input
                id="zip"
                label="Zip Code"
                value={billingInfo.zip}
                onChange={handleInputChange}
                placeholder="22434"
              />
            </div>

            <Input
              id="phone"
              label="Phone Number"
              value={billingInfo.phone}
              onChange={handleInputChange}
              placeholder="+123 456 789"
            />
          </div>

          {/* =========================================================
               Payment Section (FULLY RESPONSIVE)
          ========================================================== */}
          <div className="shadow-md bg-white p-6 rounded-md">
            <h3 className="text-lg font-semibold">Payment Method</h3>

            {/* COD */}
            <div className="mt-4 border rounded-md p-3 flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <p className="font-medium text-gray-800">Cash on Delivery (COD)</p>
            </div>

            {/* Card */}
            <div
              className={`mt-4 border rounded-md p-4 ${
                paymentMethod === "card"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <p className="font-medium">Pay with Credit Card</p>
              </div>

              {paymentMethod === "card" && (
                <>
                  <Input
                    id="cardNumber"
                    label="Card Number"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    error={errors.cardNumber}
                    placeholder="1234 5678 9101 3456"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      id="expiry"
                      label="Expiration Date"
                      value={expiry}
                      onChange={handleExpiryChange}
                      error={errors.expiry}
                      placeholder="MM/YY"
                    />

                    <Input
                      id="cvv"
                      label="Card Security Code"
                      value={cvv}
                      onChange={handleCvvChange}
                      error={errors.cvv}
                      placeholder={cardType === "amex" ? "4 digits" : "3 digits"}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-md font-semibold"
          >
            Complete Order
          </button>

        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Inputs (Auto responsive) ---------- */
function Input({ id, label, value, onChange, placeholder, error }: any) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium">{label}</label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 w-full h-11 px-3 border rounded-md outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Select({ id, label, value, onChange, options }: any) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium">{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="mt-1 w-full h-11 px-3 border border-gray-300 rounded-md outline-none"
      >
        <option value="">Select Option</option>
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
