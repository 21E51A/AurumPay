import axiosInstance from "./axiosInstance";

export const getAllCoinsApi = async () => {
  const res = await axiosInstance.get("/coins/all");
  return res.data.coins;
};

export const addCoinApi = async (data) => {
  const res = await axiosInstance.post("/coins", data);
  return res.data;
};

export const updateCoinApi = async (id, data) => {
  const res = await axiosInstance.put(`/coins/${id}`, data);
  return res.data;
};
