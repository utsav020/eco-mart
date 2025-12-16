"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        // SAVE TOKEN + USER ID IN LOCAL STORAGE
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id.toString());

        router.push("/");
      } else {
        setError(data.message || "Login failed. Try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[795px] h-[750px] mx-auto mt-24 bg-white rounded-2xl shadow-lg border border-gray-200 relative p-8 lg:p-10">
      <div className="max-w-[528px] mx-auto">
        {/* <button className="absolute top-4 right-4 text-gray-500 hover:text-black transition">
          <X size={20} />
        </button> */}

        {/* Title */}
        <h2 className="text-center text-[32px] font-bold text-[#333333]">Log in</h2>
        <p className="text-center text-[#111111] text-[16px] mt-1">
          Don’t have an Account?{" "}
          <a href="/register" className="text-[#111111] underline">
            Sign up
          </a>
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* OR Divider */}
        <div className="flex items-center my-8 gap-4">
          <div className="flex-1 h-px bg-[#666666]"></div>
          <span className="text-[#666666] text-[24px]">OR</span>
          <div className="flex-1 h-px bg-[#666666]"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-[#666666] text-[16px]">Your email</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 h-14 border border-[#66666659] rounded-lg px-4"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between">
              <label className="text-[#666666] text-[16px]">Your password</label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 flex gap-1"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="w-full mt-2 h-14 flex items-center border border-[#66666659] rounded-lg px-4">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="flex-1 outline-none"
              />
            </div>

            <div className="">
              <a>
                <p className="text-right text-[#666666] text-[18px] mt-2 underline">
                  Forgot password?
                </p>
              </a>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-full text-center text-[16px] font-medium hover:bg-black transition disabled:bg-black disabled:inset-ring-white"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
