"use client";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { api, apiGet } from "@/lib/api";
import { getUserId, logoutUser } from "../../../lib/auth";
import { ChevronDown, ChevronUp, LogOut, PencilLine, Settings } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  image_url: string;
  productName: string;
  product_description: string;
}
interface Order {
  order_id: string;
  items?: OrderItem[];
  total_amount: number;
  order_status: string;
}

export default function ProfilePage() {
  const user_id = getUserId();
  const [cancelLoading, setCancelLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
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

  if (!user_id) {
    return (
      <div className="min-h-screen mt-[300px]">
        <p className="text-lg text-center">Please login to view your profile</p>
        <div className="flex justify-center items-center gap-4">
          <a
            href="/login"
            className="mt-4 bg-black text-white px-5 py-2 rounded"
          >
            Login
          </a>

          <a
            href="/register"
            className="mt-4 bg-black text-white px-5 py-2 rounded"
          >
            Sign Up
          </a>
        </div>
      </div>
    );
  }

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
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await apiGet(`/api/user/getuserorder/${user_id}`);
      const orderList = Array.isArray(data) ? data : data.orders || [];
      setOrders(orderList);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") loadOrders();
  }, [activeTab]);

  const handleCancelOrder = async (order_id: string) => {
    if (!order_id) return;

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      setCancelLoading(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/cancelorder/${order_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order cancelled successfully");

      // 🔥 Update UI instantly
      setOrders((prev: any) =>
        prev.map((order: any) =>
          order.order_id === order_id
            ? { ...order, order_status: "Cancelled" }
            : order
        )
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      case "shipped":
        return "text-indigo-700";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      case "failed":
        return "text-red-700";
      default:
        return "text-gray-600";
    }
  };

  const handleEditChange = (e: { target: { name: any; value: any } }) => {
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
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen max-w-[1420px] mt-[150px] mb-20 mx-auto px-4">
      <div className="flex items-center mb-6 gap-3 text-[18px]">
        <div className="text-gray-600">
          <Link className="cursor-pointer" href="/">
            Home
          </Link>
        </div>

        <div>/</div>

        <div>
          <button
            className="cursor-pointer"
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex max-w-[220px] w-full justify-between h-[51px]">
          <div
            className={`w-[100px] h-[51px] flex items-center justify-center border-2 cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#077D40] text-white"
                : "bg-[#077D40] border-[#077D40] text-white"
            }`}
          >
            <Link href="/shop">Shop</Link>
          </div>

          <div
            className={`w-[100px] h-[51px] flex items-center justify-center border cursor-pointer ${
              activeTab === "orders"
                ? "hover:bg-[#077D40] hover:text-white hover:border-[#077D40]"
                : "border-[#00000080] hover:bg-[#077D40] hover:border-[#077D40] hover:text-white"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <button>My Orders</button>
          </div>
        </div>

        {/* DROPDOWN */}
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

          {openDropdown && (
            <div className="absolute top-full right-0 mt-2 w-[305px] bg-white shadow-xl rounded-xl p-4 animate-fadeIn z-50">
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

              <button
                onClick={() => {
                  setOpenEditModal(true);
                  setOpenDropdown(false);
                }}
                className="flex items-center text-[18px] font-medium gap-2 px-1 py-2 hover:bg-gray-100 rounded w-full text-left"
              >
                <PencilLine /> Edit Profile
              </button>

              <button className="flex items-center text-[18px] font-medium gap-2 px-1 py-2 hover:bg-gray-100 rounded w-full text-left">
                <Settings /> Profile Settings
              </button>

              <hr className="my-2" />

              <button
                onClick={() => {
                  logoutUser();
                  window.location.reload();
                }}
                className="flex items-center text-[18px] font-medium gap-2 px-1 py-2 hover:bg-gray-100 rounded w-full text-left"
              >
                <LogOut /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PROFILE TAB */}
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
            <p>
              <strong>Address:</strong> <br />
              {profile.address} <br />
              {profile.pinCode} <br />
              {profile.cityName}
            </p>
          </div>
        </>
      )}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-5">My Orders</h2>

          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Link
                  key={order.order_id}
                  href={`/orders/${order.order_id}`}
                  className="block p-4 rounded-lg shadow-lg lg:h-[145px] transition border lg:border-0 hover:shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="lg:w-[666.57px] relative lg:h-[109px] lg:flex justify-between items-center">
                      {/* SAVE BADGE */}
                      <div className="absolute top-4 right-3 lg:top-3 lg:right-0 lg:left-22 xl:left-28 bg-[#077D40] flex items-center justify-center text-white text-[12px] font-bold w-[100px] h-[33px] rounded-full z-10">
                        Save 20%
                      </div>
                      {/* IMAGE */}
                      <div className="">
                        <img
                          className="w-full lg:w-[220px] lg:h-[109px] h-[150px] object-cover rounded"
                          src={
                            order.items?.[0]?.image_url ||
                            "/assets/images/products/Oats.png"
                          }
                          alt="product"
                        />
                      </div>

                      {/* TEXT */}
                      <div className="xl:w-[430px] lg:w-[200px]">
                        <p className="text-lg font-bold">
                          {order.items?.[0]?.productName || "Product Name"}
                        </p>

                        <p className="text-gray-600 mt-1">
                          {order.items?.[0]?.product_description ||
                            "Description"}
                        </p>
                      </div>
                    </div>

                    <div className="lg:w-[180px]">
                      <p className="font-semibold text-lg">
                        Rs. {order.total_amount}
                      </p>
                    </div>

                    <div className="">
                      <p
                        className={`text-lg font-semibold ${getOrderStatusColor(
                          order.order_status
                        )}`}
                      >
                        {order.order_status}
                      </p>
                    </div>

                    {/* BUTTONS */}
                    <div>
                      <div className="flex gap-7 mt-2 lg:mt-0">
                        <button className="bg-[#077D40] w-[100px] h-10 text-white text-sm">
                          Track Order
                        </button>

                        <div className="">
                          {["pending", "processing"].includes(
                            order.order_status.toLowerCase()
                          ) && (
                            <button
                              onClick={(e) => {
                                e.preventDefault(); // ⛔ stop Link navigation
                                handleCancelOrder(order.order_id);
                              }}
                              disabled={cancelLoading}
                              className={`border w-[100px] h-10 text-[14px]
                            ${
                              cancelLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "border-gray-400 hover:bg-red-50"
                            }`}
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-[570px] rounded-xl shadow-xl p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <div className="space-y-3">
              {/* FIRST + LAST NAME */}
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="w-full">
                  <label>First Name</label>
                  <input
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="w-full">
                  <label>Last Name</label>
                  <input
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label>Email Address</label>
                <input
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label>Street Address</label>
                <input
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* City + Pin */}
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="w-full">
                  <label>City</label>
                  <input
                    name="cityName"
                    value={editForm.cityName}
                    onChange={handleEditChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="w-full">
                  <label>Pin Code</label>
                  <input
                    name="pinCode"
                    value={editForm.pinCode}
                    onChange={handleEditChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 mt-5">
              <button
                onClick={() => setOpenEditModal(false)}
                className="px-5 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={saveProfile}
                className="px-5 py-2 bg-[#077D40] text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}