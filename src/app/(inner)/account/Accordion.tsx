"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { api } from "@/lib/api";
import { getUserId, logoutUser } from "../../../lib/auth";

const AccountTabs = () => {
  const userId = getUserId(); // 🔥 GET USER LOGIN STATUS

  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  // ⭐ IF USER NOT LOGGED IN → SHOW LOGIN UI
  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-2">You are not logged in</h1>
        <p className="text-gray-600 mb-6">Please login to access your account</p>

        <div className="flex gap-4">
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
          >
            Sign Up
          </a>
        </div>
      </div>
    );
  }

  // ⭐ FETCH PROFILE DETAILS
  useEffect(() => {
    const fetchProfile = async () => {
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
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // ⭐ INPUT HANDLER
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ⭐ IMAGE PREVIEW HANDLER
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ⭐ SAVE PROFILE
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(api.updateProfile(userId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const result = await res.json();

      if (result.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen mt-[150px] bg-gray-50 py-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-1/4 bg-white shadow rounded-lg p-4">
            <div className="flex flex-col space-y-2">

              {["dashboard", "order", "track", "address", "account"].map((tab) => (
                <button
                  key={tab}
                  className={`text-left px-4 py-2 rounded-md capitalize ${
                    activeTab === tab ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}

              {/* LOGOUT BUTTON */}
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => {
                  logoutUser();
                  window.location.reload();
                }}
              >
                Log Out
              </button>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full md:w-3/4 bg-white shadow rounded-lg p-6">

            {/* ⭐ DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Welcome Back, {profile.firstName}!
                </h2>
                <p className="text-gray-600">
                  From your account dashboard, you can view recent orders,
                  manage your addresses, and update your profile details.
                </p>
              </div>
            )}

            {/* ⭐ ORDERS TAB */}
            {activeTab === "order" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                <p>No orders available.</p>
              </div>
            )}

            {/* ⭐ TRACK ORDER TAB */}
            {activeTab === "track" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Track Order</h2>
                <p>Tracking feature coming soon...</p>
              </div>
            )}

            {/* ⭐ ADDRESS TAB */}
            {activeTab === "address" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Address</h2>

                <p>{profile.address}</p>
                <p>{profile.cityName}</p>
                <p>{profile.pinCode}</p>

                <p className="mt-4 text-blue-600 underline cursor-pointer">
                  Edit Address
                </p>
              </div>
            )}

            {/* ⭐ ACCOUNT DETAILS TAB */}
            {activeTab === "account" && (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* PROFILE IMAGE */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={
                        profileImage ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      className="w-28 h-28 rounded-full border-4 border-gray-200 object-cover"
                    />

                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
                    >
                      <i className="fa-solid fa-camera"></i>
                    </label>

                    <input
                      type="file"
                      id="profileImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                {/* FORM INPUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="border px-4 py-2 rounded-lg"
                  />

                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="border px-4 py-2 rounded-lg"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border px-4 py-2 rounded-lg w-full"
                />

                <input
                  type="text"
                  name="phoneNo"
                  value={profile.phoneNo}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="border px-4 py-2 rounded-lg w-full"
                />

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTabs;
