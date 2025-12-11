import axios from "axios";
import { API_BASE_URL } from "./api";

export const getUserProfile = async (user_id: number) => {
  const response = await axios.get(`${API_BASE_URL}/api/user/profile/${user_id}`);
  console.log("PROFILE API RESPONSE ===>", response.data);
  return response.data;
};
