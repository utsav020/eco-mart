"use client";

import { useState, useEffect } from "react";
import { api, apiGet } from "@/lib/api";
import { getUserId, logoutUser } from "../../../lib/auth";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import router from "next/router";
import Link from "next/link";


export default function ProfilePage() {
  const user_id = getUserId();

  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // ⭐ NEW — TAB SYSTEM ADDED

  const [orders, setOrders] = useState<Array<{
    order_id: string;
    items: Array<{
      image_url: string;
      productName: string;
      product_description: string;
      price: number;
    }>;
    order_status: string;
  }>>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    cityName: "",
    pinCode: "",
    phoneNo: "",
    profileImage: "",
  });

  const [editForm, setEditForm] = useState({ ...profile });

  // ❤️ If user not logged in
  if (!user_id) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-lg">Please login to view your profile</p>
        <a href="/login" className="mt-4 bg-black text-white px-5 py-2 rounded">
          Login
        </a>
      </div>
    );
  }

  // ⭐ Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(api.getProfile(user_id));
        const data = await res.json();

        if (data.user) {
          const updatedProfile = {
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
            address: data.user.address || "",
            cityName: data.user.cityName || "",
            pinCode: data.user.pinCode || "",
            phoneNo: data.user.phoneNo || "",
            profileImage: data.user.profileImage || "",
          };

          setProfile(updatedProfile);
          setEditForm(updatedProfile);
        }
      } catch (err) {
        console.log("PROFILE ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ⭐ Load Orders when My Orders tab is selected
  const loadOrders = async () => {
    try {
      setOrdersLoading(true);

      const data = await apiGet(`/api/user/getuserorder/${user_id}`);

      const orderList = Array.isArray(data) ? data : data.orders || [];

      setOrders(orderList);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // ⭐ When activeTab changes to "orders", fetch orders
  useEffect(() => {
    if (activeTab === "orders") loadOrders();
  }, [activeTab]);

  const handleEditChange = (e: { target: { name: any; value: any; }; }) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      const res = await fetch(api.updateProfile(user_id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (data.success) {
        setProfile(editForm);
        setOpenEditModal(false);
        alert("Profile updated successfully!");
      } else {
        alert("Error updating profile");
      }
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  if (loading)
    return <div className="min-h-screen flex justify-center items-center text-lg">Loading profile...</div>;

  // ---------------------------------------------------------------------------------------------------
  // ⭐ RETURN UI
  // ---------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen max-w-[1420px] mt-[150px] mb-20 mx-auto">
      <div className="max-w-[1430px] mx-auto px-4 lg:px-0">
        <h1 className="text-xl font-semibold mb-4">Home / Profile</h1>

        {/* ---------------------------------------------------------------------------------------------------
            ⭐ TAB BUTTONS (SHOP | MY ORDERS)
        --------------------------------------------------------------------------------------------------- */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex max-w-[220px] w-full justify-between h-[51px]">

            {/* PROFILE TAB */}
            <div
              className={`w-[100px] flex items-center justify-center border-2 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#077D40] text-white"
                  : "border-[#00000080] hover:bg-[#077D40] hover:text-white"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <button>Profile</button>
            </div>

            {/* MY ORDERS TAB */}
            <div
              className={`w-[100px] flex items-center justify-center border cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#077D40] text-white border-[#077D40]"
                  : "border-[#00000080] hover:bg-[#077D40] hover:text-white"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <button>My Orders</button>
            </div>
          </div>

          {/* ---------------------------------------------------------------------------------------------------
              ⭐ DROPDOWN PROFILE MENU
          --------------------------------------------------------------------------------------------------- */}
          <div className="relative flex items-center gap-2 max-w-[306px] h-[51px] rounded-[14px] w-full bg-[#F7F7F9] shadow px-4 py-2 border border-[#C5C5C5]">
            <div
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex cursor-pointer justify-between items-center w-full"
            >
              <button className="flex items-center gap-2">
                <img
                  src={
                    profile.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="w-7 h-7 rounded-full"
                />
                <span className="font-medium">{profile.firstName}</span>
              </button>

              {openDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {/* ⭐ Dropdown Panel */}
            {openDropdown && (
              <div className="absolute top-full right-0 mt-2 w-[305px] bg-white shadow-xl rounded-xl p-4 animate-fadeIn z-50">

                {/* User Preview */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={profile.profileImage}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-gray-500 text-sm">{profile.email}</p>
                  </div>
                </div>

                <hr className="my-2" />

                {/* ⭐ Edit Profile */}
                <button
                  onClick={() => {
                    setOpenEditModal(true);
                    setOpenDropdown(false);
                  }}
                  className="flex items-center gap-2 px-1 py-2 hover:bg-gray-100 rounded w-full text-left"
                >
                  ✏️ Edit Profile
                </button>

                <button className="flex items-center gap-2 px-1 py-2 hover:bg-gray-100 rounded w-full text-left">
                  ⚙️ Profile Settings
                </button>

                <hr className="my-2" />

                {/* Logout */}
                <button
                  onClick={() => {
                    logoutUser();
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 px-1 py-2 hover:bg-gray-100 rounded w-full text-left"
                >
                  ↩️ Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------------------------------------------
            ⭐ TAB CONTENT BELOW (Profile OR Orders)
        --------------------------------------------------------------------------------------------------- */}

        {/* ⭐ PROFILE TAB SECTION */}
        {activeTab === "profile" && (
          <>
            <div className="bg-white shadow rounded-lg p-6 border">
              <h2 className="font-semibold text-lg mb-6">Profile</h2>

              <p>
                <strong>Name:</strong> {profile.firstName} {profile.lastName}
              </p>
              <p className="mt-3">
                <strong>Email:</strong> {profile.email}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 border mt-10">
              <p className="mt-3">
                <strong>Address:</strong> <br />
                {profile.address} <br />
                {profile.pinCode} <br />
                {profile.cityName}
              </p>
            </div>
          </>
        )}

        {/* ⭐ MY ORDERS TAB SECTION */}
        {activeTab === "orders" && (
          <div 
            className="bg-white cursor-pointer shadow p-6 rounded-lg border mt-6">
            <h2 className="text-2xl font-semibold mb-5">My Orders</h2>

            {ordersLoading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link 
                    href={`/orders/${order.order_id}`}>
                  <div
                    key={order.order_id}
                    className="p-4 rounded-lg shadow-lg border flex gap-4"
                  >
                    <img
                      className="w-[150px] h-[110px] object-cover rounded"
                      src={order.items?.[0]?.image_url}
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-lg">
                        {order.items?.[0]?.productName}
                      </p>

                      <p className="text-sm text-gray-600">
                        {order.items?.[0]?.product_description}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        Rs. {order.items?.[0]?.price}
                      </p>

                      <p
                        className={`text-sm ${
                          order.order_status === "Pending"
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {order.order_status}
                      </p>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------------------------------------------
          ⭐ EDIT PROFILE POPUP
      --------------------------------------------------------------------------------------------------- */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[999]">
          <div className="bg-white w-[420px] rounded-xl shadow-xl p-6 animate-fadeIn relative">

            <button
              className="absolute top-3 right-3"
              onClick={() => setOpenEditModal(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <div className="space-y-3">
              <input
                name="firstName"
                value={editForm.firstName}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="lastName"
                value={editForm.lastName}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded"
              />

              <input
                name="phoneNo"
                value={editForm.phoneNo}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded"
              />

              <textarea
                name="address"
                value={editForm.address}
                onChange={handleEditChange}
                className="w-full border px-3 py-2 rounded h-20"
              />

              <div className="flex gap-2">
                <input
                  name="cityName"
                  value={editForm.cityName}
                  onChange={handleEditChange}
                  className="w-1/2 border px-3 py-2 rounded"
                />
                <input
                  name="pinCode"
                  value={editForm.pinCode}
                  onChange={handleEditChange}
                  className="w-1/2 border px-3 py-2 rounded"
                />
              </div>
            </div>

            <button
              className="bg-green-600 text-white w-full py-2 mt-5 rounded"
              onClick={saveProfile}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
