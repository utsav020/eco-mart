"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

const AccountTabs = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    address: "",
    cityName: "",
    pinCode: "",
    phoneNo: "",
    profileImage,
  });

  const [editData, setEditData] = useState(profile);

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://ekomart-backend.onrender.com/api/user/profile/2"
        );
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();

        const user = data.user;
        setProfile({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email || "",
          address: user.address || "",
          cityName: user.cityName || "",
          pinCode: user.pinCode || "",
          phoneNo: user.phoneNo || "",
          profileImage: user.profileImage || null,
        });

        if (user.profileImage) {
          setPreview(user.profileImage);
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

  // Handle edit form field changes (inside popup)
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ FIX — Load current profile data into edit form when opening modal
  const openEditModal = () => {
    setEditData(profile);
    setShowEditModal(true);
  };

  // Handle form submit (Save)
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("firstName", editData.firstName);
      formData.append("lastName", editData.lastName);
      formData.append("address", editData.address);
      formData.append("cityName", editData.cityName);
      formData.append("pinCode", editData.pinCode);
      formData.append("phoneNo", editData.phoneNo);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await fetch(
        "https://ekomart-backend.onrender.com/api/user/edit-profile/2",
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Profile updated successfully");
        setProfile(editData);
        setShowEditModal(false);
      } else {
        alert(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong while updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[16px] py-10">
      <div className="max-w-[1430px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Tabs */}
          <div className="w-full md:w-1/4 bg-white shadow rounded-lg p-4">
            <div className="flex flex-col space-y-5">
              <div className="hover:bg-green-400 hover:text-white rounded-md">
                <button
                  className={`text-left px-4 py-2 rounded-md ${
                    activeTab === "dashboard"
                      ? "bg-blue-600 text-black"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <i className="fa-regular fa-chart-line mr-2"></i> Dashboard
                </button>
              </div>

              <div className="hover:bg-green-400 hover:text-white rounded-md">
                <button
                  className={`text-left px-4 py-2 rounded-md ${
                    activeTab === "order"
                      ? "bg-blue-600 text-black"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("order")}
                >
                  <i className="fa-regular fa-bag-shopping mr-2"></i> Orders
                </button>
              </div>

              <div className="hover:bg-green-400 hover:text-white rounded-md">
                <button
                  className={`text-left px-4 py-2 rounded-md ${
                    activeTab === "track"
                      ? "bg-blue-600 text-black"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("track")}
                >
                  <i className="fa-regular fa-tractor mr-2"></i> Track Order
                </button>
              </div>

              <div className="hover:bg-green-400 hover:text-white rounded-md">
                <button
                  className={`text-left px-4 py-2 rounded-md ${
                    activeTab === "address"
                      ? "bg-blue-600 text-black"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("address")}
                >
                  <i className="fa-regular fa-location-dot mr-2"></i> My Address
                </button>
              </div>

              <div className="hover:bg-green-400 hover:text-white rounded-md">
                <button
                  className={`text-left px-4 py-2 rounded-md ${
                    activeTab === "account"
                      ? "bg-blue-600 text-black"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("account")}
                >
                  <i className="fa-regular fa-user mr-2"></i> Account Details
                </button>
              </div>
              
              <div className="w-full hover:bg-red-500 px-4 py-2 rounded-md hover:text-white">
                <a
                  href="/login"
                  className="text-left  "
                >
                  <i className="fa-light fa-right-from-bracket mr-2"></i> Log
                  Out
                </a>
              </div>
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
                        <td className="py-2 px-4 border">
                          $125.00 for 2 items
                        </td>
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
                <h2 className="text-2xl font-semibold mb-4">
                  Track Your Order
                </h2>
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
                  <h2 className="text-xl font-semibold mb-2">
                    Billing Address
                  </h2>
                  <p className="text-gray-600">{profile.address}</p>
                  <p className="text-gray-600">{profile.cityName}</p>
                  <p className="text-gray-600">{profile.pinCode}</p>
                  <a
                    href="#"
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    Edit
                  </a>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Shipping Address
                  </h2>
                  <p className="text-gray-600">{profile.address}</p>
                  <p className="text-gray-600">{profile.cityName}</p>
                  <p className="text-gray-600">{profile.pinCode}</p>
                  <a
                    href="#"
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    Edit
                  </a>
                </div>
              </div>
            )}

            {/* Account Details */}
            {activeTab === "account" && (
              <form className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Account Details
                  </h2>
                  <div className="bg-green-600 rounded-lg font-semibold text-[15px]">
                    {/* ✅ FIX - replaced setShowEditModal(true) with openEditModal */}
                    <button
                      onClick={openEditModal}
                      type="button"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                {loading ? (
                  <p className="text-gray-500">Loading profile...</p>
                ) : (
                  <>
                    {/* Profile Image */}
                    <div className="flex flex-col items-center">
                      <div className="w-44 h-44 rounded-full overflow-hidden bg-gray-200 mb-3">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : editData.profileImage ? (
                          <img
                            src={editData.profileImage}
                            alt="Current Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fa-regular fa-user ml-17 mt-15 text-gray-400 text-5xl flex items-center justify-center w-full h-full"></i>
                        )}
                      </div>
                      {/* <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label> */}
                    </div>

                    {/* Profile Info */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="border border-gray-300 rounded-lg">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={profile.firstName}
                          onChange={handleChange}
                          className="px-3 py-2 w-full focus:ring focus:ring-blue-200"
                        />
                      </div>

                      <div className="border border-gray-300 rounded-lg">
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={profile.lastName}
                          onChange={handleChange}
                          className="px-3 py-2 w-full focus:ring focus:ring-blue-200"
                        />
                      </div>
                    </div>

                    <div className="border border-gray-300 rounded-lg">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={profile.email}
                        onChange={handleChange}
                        className="px-3 py-2 w-full focus:ring focus:ring-blue-200"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-lg">
                      <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={profile.address}
                        onChange={handleChange}
                        className="px-3 py-2 w-full focus:ring focus:ring-blue-200"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-lg">
                      <input
                        type="text"
                        name="cityName"
                        placeholder="City Name"
                        value={profile.cityName}
                        onChange={handleChange}
                        className="px-3 py-2 w-full focus:ring focus:ring-blue-200"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-lg">
                      <input
                        type="text"
                        name="pinCode"
                        placeholder="Pincode"
                        value={profile.pinCode}
                        onChange={handleChange}
                        className="px-3 py-2 w-full focus:ring focus:ring-blue-200"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-lg">
                      <input
                        type="text"
                        name="phoneNo"
                        placeholder="Phone No"
                        value={profile.phoneNo}
                        onChange={handleChange}
                        className="px-3 py-2 w-full focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </>
                )}
              </form>
            )}

            {/* ✅ Edit Profile Modal */}
            {showEditModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-auto max-w-[1100px] rounded-lg p-6 relative">
                  <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="w-34 h-34 rounded-full overflow-hidden bg-gray-200 mb-3">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : editData.profileImage ? (
                          <img
                            src={editData.profileImage}
                            alt="Current Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fa-regular fa-user text-gray-400 text-5xl flex items-center justify-center w-full h-full"></i>
                        )}
                      </div>
                      <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-300 rounded-lg ">
                        <input
                          type="text"
                          name="firstName"
                          value={editData.firstName}
                          onChange={handleEditChange}
                          placeholder="First Name"
                          className="px-3 py-2 w-full"
                        />
                      </div>

                      <div className="border border-gray-300 rounded-lg ">
                        <input
                          type="text"
                          name="lastName"
                          value={editData.lastName}
                          onChange={handleEditChange}
                          placeholder="Last Name"
                          className="px-3 py-2 w-full"
                        />
                      </div>
                    </div>

                    <div className="border border-gray-300 rounded-lg ">
                      <input
                        type="text"
                        name="address"
                        value={editData.address}
                        onChange={handleEditChange}
                        placeholder="Address"
                        className="px-3 py-2 w-full"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-lg ">
                      <input
                        type="text"
                        name="cityName"
                        value={editData.cityName}
                        onChange={handleEditChange}
                        placeholder="City Name"
                        className="px-3 py-2 w-full"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-lg ">
                      <input
                        type="text"
                        name="pinCode"
                        value={editData.pinCode}
                        onChange={handleEditChange}
                        placeholder="Pincode"
                        className="px-3 py-2 w-full"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-lg ">
                      <input
                        type="text"
                        name="phoneNo"
                        value={editData.phoneNo}
                        onChange={handleEditChange}
                        placeholder="Phone Number"
                        className="px-3 py-2 w-full"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <div className="bg-red-600 rounded-lg font-bold text-[16px]">
                        <button
                          type="button"
                          onClick={() => setShowEditModal(false)}
                          className="px-4 py-2 text-white rounded-lg hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="bg-green-600 rounded-lg font-bold text-[16px]">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTabs;
