import axios from "axios";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivateJSON = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const axiosPrivateFormData = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});
