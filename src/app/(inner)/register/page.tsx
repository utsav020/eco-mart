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

  const [profilImage, setProfilImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setProfilImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Submit form
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

      // VERY IMPORTANT → backend requires "profilImage"
      if (profilImage) {
        formDataToSend.append("profilImage", profilImage);
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

        // SAVE USER ID IN LOCAL STORAGE
        if (data.user_id) {
          localStorage.setItem("user_id", data.user_id.toString());
        }

        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-[550px] bg-white rounded-xl shadow-lg border p-8">
        <h2 className="text-center text-2xl font-bold">Create Account</h2>
        <p className="text-center text-gray-500 text-sm mt-1">
          Already have an Account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
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
              <label className="text-sm">First Name</label>
              <input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm">Last Name</label>
              <input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm">Address</label>
            <input
              id="address"
              type="text"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* City + Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">City</label>
              <input
                id="cityName"
                type="text"
                required
                value={formData.cityName}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm">Pin Code</label>
              <input
                id="pinCode"
                type="text"
                required
                value={formData.pinCode}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm">Phone Number</label>
            <input
              id="phoneNo"
              type="text"
              required
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Image */}
          <div>
            <label className="text-sm">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mt-2 border rounded-lg p-2"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                className="w-20 h-20 rounded-full object-cover mt-3 border"
                alt="preview"
              />
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm">Email</label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm">Password</label>
            <div className="w-full mt-2 flex items-center border rounded-lg px-4 py-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="flex-1 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
