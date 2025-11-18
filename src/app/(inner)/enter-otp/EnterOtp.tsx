"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function EnterOtp({ apiBase = "/api/auth" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(60); // Resend timer

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Load email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  // OTP Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // Only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Handle Backspace key for moving back
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const otpValue = otp.join("");
    if (otpValue.length !== 6) return setError("Please enter the 6-digit OTP.");

    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      if (!res.ok) throw new Error("Invalid or expired OTP.");

      setSuccess("✅ OTP verified successfully!");
      localStorage.setItem("verifiedOtp", otpValue);

      setTimeout(() => router.push("/reset-password"), 1200);
    } catch (err: any) {
      setError(err.message || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to resend OTP.");
      setSuccess("✅ OTP resent successfully!");
      setTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Verify OTP</h1>
          <p className="text-gray-500 text-sm mt-1">
            We’ve sent a 6-digit code to{" "}
            <span className="font-medium text-indigo-600">{email || "your email"}</span>
          </p>
        </div>

        {/* Alerts */}
        {error && <p className="text-red-600 text-sm text-center mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center mb-3">{success}</p>}

        {/* OTP Boxes */}
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border border-gray-300 rounded-lg text-center text-2xl font-semibold
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <button
            type="button"
            disabled={timer > 0}
            onClick={handleResendOtp}
            className={`${
              timer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:underline"
            }`}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
          <a href="/signin" className="hover:underline">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
