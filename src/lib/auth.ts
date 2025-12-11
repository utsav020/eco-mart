export const getUserId = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_id");
};

export const setuser_id = (id: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_id", id);
  }
};

export const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_id");
  }
};
