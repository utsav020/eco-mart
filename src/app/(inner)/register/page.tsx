"use client";

import { API_BASE_URL } from "@/lib/api";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation"; // ✅ added for navigation

interface FormData {
  firstName: string;
  lastName: string;
  address: string;
  cityName: string;
  pinCode: string;
  phoneNo: string;
  email: string;
  password: string;
  profileImage: File | null;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    address: "",
    cityName: "",
    pinCode: "",
    phoneNo: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const router = useRouter(); // ✅ initialize router

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, profileImage: file });

      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = (): boolean => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (!formData.phoneNo.match(/^\d{10}$/)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }

    if (!formData.pinCode.match(/^\d{6}$/)) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("address", formData.address);
      submitData.append("cityName", formData.cityName);
      submitData.append("pinCode", formData.pinCode);
      submitData.append("phoneNo", formData.phoneNo);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);

      if (formData.profileImage) {
        submitData.append("profileImage", formData.profileImage);
      }

      const res = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registration successful!");
        setFormData({
          firstName: "",
          lastName: "",
          address: "",
          cityName: "",
          pinCode: "",
          phoneNo: "",
          email: "",
          password: "",
          profileImage: null,
        });
        setImagePreview("");

        // ✅ Redirect to login page after short delay
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(
        "An error occurred. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center w-full mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join us today and start your shopping journey
          </p>
        </div>

        <div className="bg-white w-full border-2 rounded-2xl shadow-xl">
          <div className="md:flex">
            {/* Left Side - Form */}
            <div className="md:w-3/3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-[16px] font-medium text-gray-700 mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-[16px] font-medium text-gray-700 mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[16px] font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phoneNo"
                    className="block text-[16px] font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNo"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your 10-digit phone number"
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-[16px] font-medium text-gray-700 mb-2"
                  >
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* City */}
                  <div>
                    <label
                      htmlFor="cityName"
                      className="block text-[16px] font-medium text-gray-700 mb-2"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="cityName"
                      name="cityName"
                      value={formData.cityName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your city"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label
                      htmlFor="pinCode"
                      className="block text-[16px] font-medium text-gray-700 mb-2"
                    >
                      Pincode *
                    </label>
                    <input
                      type="text"
                      id="pinCode"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter 6-digit pincode"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[16px] font-medium text-gray-700 mb-2"
                  >
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Profile Image */}
                <div>
                  <label
                    htmlFor="profileImage"
                    className="block text-[16px] font-medium text-gray-700 mb-2"
                  >
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-6">
                    {imagePreview ? (
                      <img
                        className="h-16 w-16 object-cover rounded-full border-2 border-gray-300"
                        src={imagePreview}
                        alt="Preview"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleChange}
                      className="block w-full text-[16px] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[16px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* Error/Success */}
                {error && (
                  <p className="p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="p-3 bg-green-100 text-green-700 rounded-lg">
                    {success}
                  </p>
                )}

                {/* Submit */}
                <div className="bg-green-200 text-[16px] text-black">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-lg font-semibold"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-600">
          <p className="text-[16px]">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
            and
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
