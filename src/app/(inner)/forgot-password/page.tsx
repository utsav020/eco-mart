"use client";

import { useState } from "react";

export default function ForgotPassword({
  apiEndpoint = "/api/auth/forgot-password",
}: {
  apiEndpoint?: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const validateEmail = (value: string) => {
    return /^\S+@\S+\.\S+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to send reset email.");
      }

      setSent(true);
    } catch (err) {
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-[500px] w-full bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl text-center font-semibold text-gray-800 mb-3">
          Forgot your password?
        </h2>
        <p className="text-[14px] text-gray-500 mb-6">
          Enter the email associated with your account and we'll send a link to
          reset your password.
        </p>

        {sent ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">
              If an account with that email exists, we've sent a password reset
              link.
            </p>
            <p className="text-[14px] text-gray-500 mt-2">
              Check your inbox (including spam).
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                onClick={() => setSent(false)}
              >
                Send another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label
              htmlFor="email"
              className="block text-[14px] font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="rounded-md border border-gray-300">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2"
                required
              />
            </div>

            {error && <p className="text-[14px] text-red-600 mt-3">{error}</p>}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  loading
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <a
                href="/signin"
                className="text-[14px] text-indigo-600 hover:underline"
              >
                Back to sign in
              </a>
            </div>
          </form>
        )}

        <div className="mt-6 text-[12px] text-gray-400">
          Tip: Your backend should not reveal if an email exists.
        </div>
      </div>
    </div>
  );
}
