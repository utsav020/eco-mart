  "use client";

  import { useState, useEffect, ChangeEvent, FormEvent } from "react";
  import { api } from "@/lib/api";
  import { getUserId } from "../../../lib/auth";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiLock,
    FiShield,
  } from "react-icons/fi";
  import { AiOutlineLoading3Quarters } from "react-icons/ai";
  import { useRouter } from "next/navigation"; // ✅ FIXED

  const AccountTabs = () => {
    const userId = getUserId();
    const router = useRouter(); // ✅ FIXED

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
      firstName: "",
      lastName: "",
      displayName: "",
      email: "",
      address: "",
      cityName: "",
      pinCode: "",
      phoneNo: "",
    });

    // ⭐ Fetch User Profile
    useEffect(() => {
      const fetchProfile = async () => {
        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          const res = await fetch(api.getProfile(userId));
          const data = await res.json();

          if (data.user) {
            setProfile({
              firstName: data.user.firstName || "",
              lastName: data.user.lastName || "",
              displayName:
                (data.user.firstName || "") + " " + (data.user.lastName || ""),
              email: data.user.email || "",
              address: data.user.address || "",
              cityName: data.user.cityName || "",
              pinCode: data.user.pinCode?.toString() || "",
              phoneNo: data.user.phoneNo || "",
            });
          }
        } catch (error) {
          toast.error("Failed to load profile");
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }, [userId]);

    // ⭐ Handle Input Change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setProfile((prev) => ({ ...prev, [name]: value }));
    };

    // ⭐ Save + Continue to Payment Page
    const handleContinue = async () => {
      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      setSaving(true);

      try {
        const res = await fetch(api.updateProfile(userId), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });

        const result = await res.json();

        const isSuccess =
          result.success === true ||
          result.status === true ||
          result.message?.toLowerCase().includes("success");

        if (isSuccess) {
          toast.success("Details saved");

          // Redirect after 1 second
          setTimeout(() => {
            router.push("/payment");
          }, 1000);
        } else {
          toast.error(result.message || "Failed to save details");
        }
      } catch (error) {
        toast.error("Something went wrong!");
        console.error(error);
      }

      setSaving(false);
    };

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-blue-50">
          <div className="flex flex-col items-center">
            <AiOutlineLoading3Quarters className="text-4xl text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 py-8 md:py-12">
        <ToastContainer />

        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* MAIN CONTENT */}
            <div className="lg:w-3/4 max-w-full mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <div className="mb-8">
                  <p className="text-2xl text-center font-bold text-gray-900">
                    Order Details
                  </p>
                </div>

                <form className="space-y-6">
                  {/* Name Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border rounded-md"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phoneNo"
                        value={profile.phoneNo}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border rounded-md"
                      />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="cityName"
                          value={profile.cityName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="pinCode"
                          value={profile.pinCode}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-4 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border rounded-md"
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="flex justify-center pt-6 border-t">
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={saving}
                      className="px-6 py-3 bg-black text-white rounded-lg font-medium transition-all disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Continue"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default AccountTabs;
