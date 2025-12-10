export const getUserId = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userId");
};

export const setUserId = (id: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userId", id);
  }
};

export const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userId");
  }
};
