"use client";

import { useState } from "react";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) return setError("Email is required.");
    if (!validateEmail(email)) return setError("Enter a valid email address.");

    try {
      setLoading(true);

      const res = await fetch(
        "https://ekomart-backend.onrender.com/api/user/request-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send reset link.");
      }

      setSuccess("✅ Reset instructions sent to your email.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h1>
        <p className="text-sm text-center text-gray-500 mt-2 mb-6">
          Enter your email and we’ll send you reset instructions.
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* ✅ FOOTER LINKS */}
        <div className="mt-6 flex justify-between text-sm">
          <a href="/signin" className="text-indigo-600 hover:underline">
            Back to sign in
          </a>
          <a href="/signup" className="text-gray-500 hover:underline">
            Create account
          </a>
        </div>

        {/* ✅ SECURITY NOTE */}
        <p className="mt-6 text-xs text-center text-gray-400">
          For security, we won’t confirm whether an email exists in our system.
        </p>
      </div>
    </div>
  );
}
