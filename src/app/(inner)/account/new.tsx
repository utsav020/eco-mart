"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

const AccountTabs = () => {
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

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://ekomart-backend.onrender.com/api/user/profile/2"
        );
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
            pinCode: data.user.pinCode || "",
            phoneNo: data.user.phoneNo || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle form submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Updated Profile Data:", profile);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Tabs */}
          <div className="w-full md:w-1/4 bg-white shadow rounded-lg p-4">
            <div className="flex flex-col space-y-2">
              <button
                className={`text-left px-4 py-2 rounded-md ${
                  activeTab === "dashboard"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <i className="fa-regular fa-chart-line mr-2"></i> Dashboard
              </button>
              <button
                className={`text-left px-4 py-2 rounded-md ${
                  activeTab === "order"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("order")}
              >
                <i className="fa-regular fa-bag-shopping mr-2"></i> Orders
              </button>
              <button
                className={`text-left px-4 py-2 rounded-md ${
                  activeTab === "track"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("track")}
              >
                <i className="fa-regular fa-tractor mr-2"></i> Track Order
              </button>
              <button
                className={`text-left px-4 py-2 rounded-md ${
                  activeTab === "address"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("address")}
              >
                <i className="fa-regular fa-location-dot mr-2"></i> My Address
              </button>
              <button
                className={`text-left px-4 py-2 rounded-md ${
                  activeTab === "account"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("account")}
              >
                <i className="fa-regular fa-user mr-2"></i> Account Details
              </button>
              <a
                href="/login"
                className="text-left px-4 py-2 rounded-md hover:bg-gray-100"
              >
                <i className="fa-light fa-right-from-bracket mr-2"></i> Log Out
              </a>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full md:w-3/4 bg-white shadow rounded-lg p-6">
            {/* Dashboard */}
            {activeTab === "dashboard" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Hello {profile.firstName || "User"}!
                </h2>
                <p className="text-gray-600">
                  From your account dashboard you can view your recent orders,
                  manage your shipping and billing addresses, and edit your
                  account details.
                </p>
              </div>
            )}

            {/* Orders */}
            {activeTab === "order" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="py-2 px-4 border">Order</th>
                        <th className="py-2 px-4 border">Date</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Total</th>
                        <th className="py-2 px-4 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="py-2 px-4 border">#1357</td>
                        <td className="py-2 px-4 border">March 45, 2020</td>
                        <td className="py-2 px-4 border">Processing</td>
                        <td className="py-2 px-4 border">$125.00 for 2 items</td>
                        <td className="py-2 px-4 border text-blue-600">
                          <a href="#">View</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Track Order */}
            {activeTab === "track" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Track Your Order</h2>
                <p className="text-gray-600 mb-4">
                  Enter your Order ID and Billing Email to track your order
                  status.
                </p>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Order ID
                    </label>
                    <input
                      type="text"
                      placeholder="Found in your confirmation email"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Billing Email
                    </label>
                    <input
                      type="email"
                      placeholder="Email used during checkout"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Track
                  </button>
                </form>
              </div>
            )}

            {/* Address */}
            {activeTab === "address" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Billing Address</h2>
                  <p className="text-gray-600">{profile.address}</p>
                  <p className="text-gray-600">{profile.cityName}</p>
                  <p className="text-gray-600">{profile.pinCode}</p>
                  <a href="#" className="text-blue-600 hover:underline mt-2 block">
                    Edit
                  </a>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
                  <p className="text-gray-600">{profile.address}</p>
                  <p className="text-gray-600">{profile.cityName}</p>
                  <p className="text-gray-600">{profile.pinCode}</p>
                  <a href="#" className="text-blue-600 hover:underline mt-2 block">
                    Edit
                  </a>
                </div>
              </div>
            )}

            {/* Account Details */}
            {activeTab === "account" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={
                        profileImage ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="Profile"
                      className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
                    />
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700"
                    >
                      <i className="fa-solid fa-camera text-sm"></i>
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

                {loading ? (
                  <p className="text-center text-gray-500">Loading...</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                      />
                    </div>
                    <input
                      type="text"
                      name="displayName"
                      value={profile.displayName}
                      onChange={handleChange}
                      placeholder="Display Name"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="Email Address *"
                      required
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                    />
                    <input
                      type="text"
                      name="phoneNo"
                      value={profile.phoneNo}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTabs;
