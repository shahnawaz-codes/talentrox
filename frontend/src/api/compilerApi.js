import { axiosInstance } from "../lib/axios";

const compilerApi = async (payload) => {
  const res = await axiosInstance.post("/execute", payload);
  console.log(res.data);
  console.log(res.data?.output);
  return res.data;
};

export default compilerApi;
