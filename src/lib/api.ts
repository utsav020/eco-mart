export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ekomart-backend.onrender.com";

export const api = {
  getProfile: (id: string) => `${API_BASE_URL}/api/user/profile/${id}`,
  updateProfile: (id: string) => `${API_BASE_URL}/api/user/edit-profile/${id}`,
  login: `${API_BASE_URL}/api/user/login`,
  signup: `${API_BASE_URL}/api/user/register`,
};

export async function   apiGet(path: string) {
  const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}

// import axios from "axios";

// // ---- BASE URL ----
// export const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "https://ekomart-backend.onrender.com/api";

// // ---- NAMED API ENDPOINTS (auto usable) ----
// export const api = {
//   login: "/user/login",
//   signup: "/user/register",
//   getProfile: (id: string) => `/user/profile/${id}`,
//   updateProfile: (id: string) => `/user/edit-profile/${id}`,

//   // CART
//   cart: {
//     getCart: "/cart/getcart",
//     checkout: "/cart/checkoutcart",
//     summary: "/cart/checkoutcart/summary",
//     removeItem: "/cart/removeitem",
//   },
// };

// // ---- AXIOS INSTANCE ----
// export const apiRouts = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ---- TOKEN INTERCEPTOR ----
// apiRouts.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
