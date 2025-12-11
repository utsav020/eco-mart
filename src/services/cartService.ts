import { api, apiRouts } from "@/lib/api";

export const getCart = async (user_id: string) => {
  return apiRouts.get(`/cart/getcart`, { params: { user_id } });
};

// export const checkoutCart = async (payload: any) => {
//   return apiRouts.post(`/cart/checkoutcart`, payload);
// };

// export const getCartSummary = async (user_id: string) => {
//   return apiRouts.get(`/cart/checkoutcart/summary`, { params: { user_id } });
// };

// export const removeCartItem = async (cart_item_id: string) => {
//   return apiRouts.delete(`/cart/removeitem`, { params: { cart_item_id } });
// };
