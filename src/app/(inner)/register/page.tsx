"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    cityName: "",
    pinCode: "",
    phoneNo: "",
    email: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setError("");
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("cityName", formData.cityName);
      formDataToSend.append("pinCode", formData.pinCode);
      formDataToSend.append("phoneNo", formData.phoneNo);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);

      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      const response = await fetch(
        "https://ekomart-backend.onrender.com/api/user/register",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully!");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4 py-10">
      <div className="w-full max-w-[550px] bg-white rounded-2xl shadow-lg border border-gray-200 p-8 lg:p-10">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Create Account
        </h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Already have an Account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>

        {/* Error */}
        {error && (
          <p className="mt-5 bg-red-100 text-red-700 border border-red-300 p-3 rounded text-sm">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="mt-5 bg-green-100 text-green-700 border border-green-300 p-3 rounded text-sm">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* First + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">First Name</label>
              <input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Last Name</label>
              <input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm text-gray-700">Address</label>
            <input
              id="address"
              type="text"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* City + Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">City</label>
              <input
                id="cityName"
                type="text"
                required
                value={formData.cityName}
                onChange={handleChange}
                placeholder="City name"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Pincode</label>
              <input
                id="pinCode"
                type="text"
                required
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Postal code"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-sm text-gray-700">Phone Number</label>
            <input
              id="phoneNo"
              type="text"
              required
              value={formData.phoneNo}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="text-sm text-gray-700">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mt-2 border border-gray-300 rounded-lg p-2"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                className="w-20 h-20 rounded-full object-cover mt-3"
                alt="preview"
              />
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <div className="w-full mt-2 flex items-center border border-gray-300 rounded-lg px-4 py-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="flex-1 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-medium transition disabled:bg-blue-300"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
