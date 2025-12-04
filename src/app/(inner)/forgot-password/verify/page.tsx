"use client";

import { useState, useRef } from "react";

export default function VerifyResetCode() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // ✅ Handle OTP Input
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // ✅ Handle Backspace Navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && inputsRef.current[index - 1]) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ✅ Submit OTP
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return setError("Please enter the full 6-digit verification code.");
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://ekomart-backend.onrender.com/api/user/verify-reset-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            otp: finalOtp, // ✅ ONLY OTP SENT
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "OTP verification failed.");
      }

      setSuccess("✅ OTP verified successfully. Redirecting...");
      setTimeout(() => {
        window.location.href = "/reset-password";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Verify Reset Code
        </h1>
        <p className="text-sm text-center text-gray-500 mt-2 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        {/* ✅ ERROR MESSAGE */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm p-3">
            {error}
          </div>
        )}

        {/* ✅ SUCCESS MESSAGE */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 text-green-700 text-sm p-3">
            {success}
          </div>
        )}

        {/* ✅ FORM */}
        <form onSubmit={handleVerify} className="space-y-6">
          {/* ✅ OTP INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              6-Digit Verification Code
            </label>

            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              ))}
            </div>
          </div>

          {/* ✅ VERIFY BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        {/* ✅ FOOTER LINKS */}
        <div className="mt-6 flex justify-between text-sm">
          <a href="/forgot-password" className="text-gray-500 hover:underline">
            Back
          </a>
          <a href="/signin" className="text-indigo-600 hover:underline">
            Back to Sign In
          </a>
        </div>

        {/* ✅ SECURITY FOOTER */}
        <p className="mt-6 text-xs text-center text-gray-400">
          Never share your OTP with anyone.
        </p>
      </div>
    </div>
  );
}
