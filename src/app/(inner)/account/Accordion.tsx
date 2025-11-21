"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

const AccountTabs = () => {
  // Use a safe source for userId (for example, from localStorage after login).
  // This avoids referencing an undefined `id`. Update this to use auth/session when available.
  const userId = typeof window !== "undefined" ? (localStorage.getItem("userId") ?? "") : "";

  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
    profileImage: "",
  });

  const [editData, setEditData] = useState(profile);

  // ✅ Fetch User Data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://ekomart-backend.onrender.com/api/user/profile/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        const user = data.user;

        const formatted = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          displayName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email || "",
          address: user.address || "",
          cityName: user.cityName || "",
          pinCode: user.pinCode || "",
          phoneNo: user.phoneNo || "",
          profileImage: user.profileImage || "",
        };

        setProfile(formatted);
        setEditData(formatted);

        if (user.profileImage) {
          setPreviewImage(user.profileImage);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle edit form input
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload (File)
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Open Edit Modal
  const openEditModal = () => {
    setEditData(profile);
    setProfileImageFile(null);
    setShowEditModal(true);
  };

  // Submit edit data
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

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const response = await fetch(
        `https://ekomart-backend.onrender.com/api/user/edit-profile/${userId}`,
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
        alert(result.message || "Failed to update");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 text-[16px]">
      <div className="max-w-[1430px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-1/4 bg-white shadow rounded-lg p-4">
            <div className="flex flex-col space-y-5">

              {["dashboard", "order", "track", "address", "account"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-left ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {tab === "dashboard" && "📊 Dashboard"}
                    {tab === "order" && "🛍 Orders"}
                    {tab === "track" && "🚚 Track Order"}
                    {tab === "address" && "📍 Address"}
                    {tab === "account" && "👤 Account Details"}
                  </button>
                )
              )}

              <a
                href="/login"
                className="px-4 py-2 hover:bg-red-500 hover:text-white rounded-md"
              >
                Logout
              </a>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full md:w-3/4 bg-white shadow rounded-lg p-6">

            {/* ACCOUNT DETAILS TAB */}
            {activeTab === "account" && (
              <>
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Account Details</h2>
                  <button
                    onClick={openEditModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* SHOW PROFILE DETAILS */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <i className="fa-regular fa-user text-5xl" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p className="border px-3 py-2">{profile.firstName}</p>
                  <p className="border px-3 py-2">{profile.lastName}</p>
                </div>

                <p className="border px-3 py-2 mt-4">{profile.email}</p>
                <p className="border px-3 py-2 mt-4">{profile.address}</p>
                <p className="border px-3 py-2 mt-4">{profile.cityName}</p>
                <p className="border px-3 py-2 mt-4">{profile.pinCode}</p>
                <p className="border px-3 py-2 mt-4">{profile.phoneNo}</p>
              </>
            )}

            {/* YOU CAN KEEP OTHER TABS SAME */}
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">

              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <i className="fa-regular fa-user text-5xl" />
                    </div>
                  )}
                </div>

                <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleEditChange}
                  className="border px-3 py-2 rounded"
                  placeholder="First Name"
                />
                <input
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleEditChange}
                  className="border px-3 py-2 rounded"
                  placeholder="Last Name"
                />
              </div>

              <input
                name="address"
                value={editData.address}
                onChange={handleEditChange}
                className="border px-3 py-2 rounded w-full"
                placeholder="Address"
              />

              <input
                name="cityName"
                value={editData.cityName}
                onChange={handleEditChange}
                className="border px-3 py-2 rounded w-full"
                placeholder="City"
              />

              <input
                name="pinCode"
                value={editData.pinCode}
                onChange={handleEditChange}
                className="border px-3 py-2 rounded w-full"
                placeholder="Pincode"
              />

              <input
                name="phoneNo"
                value={editData.phoneNo}
                onChange={handleEditChange}
                className="border px-3 py-2 rounded w-full"
                placeholder="Phone No"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountTabs;
