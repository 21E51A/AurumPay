import axiosInstance from "./axiosInstance";

export const loginApi = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data; // { token }
};
