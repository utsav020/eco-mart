"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import FooterTwo from "../../../components/footer/FooterTwo";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: { target: { id: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://ekomart-backend.onrender.com/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        router.push("/index-three");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="container mx-auto px4">
          <div className="flex items-center space-x-2 text-[16px] text-gray-600">
            <a href="/" className="hover:text-blue-600 transition-colors">
              Home
            </a>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-medium">Login</span>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="py-12 border-2 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Card Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                  <img
                    className="w-10 h-10 object-contain"
                    src="assets/images/logo/fav.png"
                    alt="logo"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h3>
                <p className="text-gray-600">Sign in to your account</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 text-[16px]">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[16px] font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-[16px] font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="w-full flex justify-between py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10">
                    <div className="">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className=""
                        placeholder="Enter your password"
                      />
                    </div>

                    <div className="">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className=" text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <Eye className="w-8" />
                        ) : (
                          <EyeOff className="w-8" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[16px]">
                  <label className="flex items-center space-x-2">
                    <div className="flex gap-3">
                      <div className="">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>

                      <div className="">
                        <span className="text-gray-600">Remember me</span>
                      </div>
                    </div>
                  </label>
                  <div className="">
                    <a
                      href="/forgot-password"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div className="w-full border-gray-400 border hover:border-green-600 hover:text-white text-[15px] rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></div>
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      "Login Account"
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="mt-6 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-[16px]">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Login */}
              <div className="flex justify-center space-x-4">
                <div className="w-full h-full flex items-center justify-center border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  <button
                    type="button"
                    className="flex items-center justify-center"
                  >
                    <img
                      src="assets/images/form/google.svg"
                      alt="Google login"
                      className="w-35 h-5 p-3"
                    />
                  </button>
                </div>
                <div className="w-full h-full flex items-center justify-center border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  <button
                    type="button"
                    className="flex items-center justify-center"
                  >
                    <img
                      src="assets/images/form/facebook.svg"
                      alt="Facebook login"
                      className="w-36 h-5 p-3"
                    />
                  </button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-6 pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-[16px]">
                  Don't have an account?{" "}
                  <span className=" ">
                    <a
                      href="/register"
                      className="font-medium"
                    >
                      Sign up now
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterTwo />
    </div>
  );
}
