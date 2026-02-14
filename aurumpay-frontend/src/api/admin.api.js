import axiosInstance from "./axiosInstance";

export const getRevenueSummary = async () => {
  const res = await axiosInstance.get("/coin-orders/summary");
  return res.data.summary;
};
